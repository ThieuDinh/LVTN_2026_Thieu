using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.ImportOrder;
using NongSan.Application.Interfaces;
using NongSan.Domain.Entities;
using NongSan.Domain.Enums;

namespace NongSan.Application.Services;

public class ImportOrderService : IImportOrderService
{
    private readonly IAppDbContext _context;

    public ImportOrderService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ImportOrderResponse>> CreateAsync(int shopId, CreateImportOrderRequest request)
    {
        // Kiểm tra shop đang hoạt động
        var shop = await _context.Shops.FindAsync(shopId);
        if (shop == null || shop.Status != ShopStatus.Active)
            return Result<ImportOrderResponse>.Fail("Shop chưa được duyệt hoặc đang bị tạm ngưng.");

        // Kiểm tra ImportCode trùng trong cùng shop
        var codeExists = await _context.ImportOrders
            .AnyAsync(o => o.ShopId == shopId && o.ImportCode == request.ImportCode);

        if (codeExists)
            return Result<ImportOrderResponse>.Fail("Mã phiếu nhập đã tồn tại trong shop.");

        // Kiểm tra tất cả variant thuộc về shop này
        var variantIds = request.Items.Select(i => i.VariantId).ToList();
        var validVariants = await _context.ProductVariants
            .Include(v => v.Product)
            .Where(v => variantIds.Contains(v.Id) && v.Product.ShopId == shopId)
            .Select(v => v.Id)
            .ToListAsync();

        if (validVariants.Count != variantIds.Distinct().Count())
            return Result<ImportOrderResponse>.Fail("Một hoặc nhiều biến thể không thuộc shop của bạn.");

        var importOrder = new ImportOrder
        {
            ShopId = shopId,
            ImportCode = request.ImportCode.Trim(),
            HarvestSeason = request.HarvestSeason?.Trim(),
            SupplierName = request.SupplierName?.Trim(),
            Note = request.Note,
            DocumentImages = request.DocumentImages,
            Status = ImportOrderStatus.Draft,
            ImportedAt = DateTime.UtcNow
        };

        _context.ImportOrders.Add(importOrder);
        await _context.SaveChangesAsync();

        decimal totalCost = 0;

        foreach (var item in request.Items)
        {
            var importItem = new ImportOrderItem
            {
                ImportOrderId = importOrder.Id,
                VariantId = item.VariantId,
                BatchCode = item.BatchCode.Trim(),
                Quantity = item.Quantity,
                RemainingQty = item.Quantity,
                CostPrice = item.CostPrice,
                ManufacturedAt = item.ManufacturedAt,
                ExpiredAt = item.ExpiredAt,
                Status = ImportOrderItemStatus.Active
            };

            totalCost += item.CostPrice * item.Quantity;
            _context.ImportOrderItems.Add(importItem);
        }

        importOrder.TotalCost = totalCost;
        await _context.SaveChangesAsync();

        return await GetByIdAsync(importOrder.Id, shopId);
    }

    public async Task<Result<ImportOrderResponse>> GetByIdAsync(int importOrderId, int shopId)
    {
        var order = await _context.ImportOrders
            .Include(o => o.Items)
                .ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(o => o.Id == importOrderId && o.ShopId == shopId);

        if (order == null)
            return Result<ImportOrderResponse>.Fail("Phiếu nhập không tồn tại hoặc bạn không có quyền.");

        return Result<ImportOrderResponse>.Ok(MapToResponse(order));
    }

    public async Task<Result<List<ImportOrderResponse>>> GetByShopAsync(int shopId)
    {
        var orders = await _context.ImportOrders
            .Include(o => o.Items)
                .ThenInclude(i => i.Variant)
            .Where(o => o.ShopId == shopId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var response = orders.Select(MapToResponse).ToList();
        return Result<List<ImportOrderResponse>>.Ok(response);
    }

    public async Task<Result<ImportOrderResponse>> ConfirmAsync(int importOrderId, int shopId)
    {
        var order = await _context.ImportOrders
            .Include(o => o.Items)
                .ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(o => o.Id == importOrderId && o.ShopId == shopId);

        if (order == null)
            return Result<ImportOrderResponse>.Fail("Phiếu nhập không tồn tại hoặc bạn không có quyền.");

        if (order.Status == ImportOrderStatus.Confirmed)
            return Result<ImportOrderResponse>.Fail("Phiếu nhập đã được xác nhận trước đó.");

        // Xác nhận phiếu nhập → cộng tồn kho cho các variant
        order.Status = ImportOrderStatus.Confirmed;

        foreach (var item in order.Items)
        {
            item.Variant.Stock += item.RemainingQty;
        }

        await _context.SaveChangesAsync();

        return Result<ImportOrderResponse>.Ok(MapToResponse(order));
    }

    private static ImportOrderResponse MapToResponse(ImportOrder order) => new()
    {
        Id = order.Id,
        ShopId = order.ShopId,
        ImportCode = order.ImportCode,
        HarvestSeason = order.HarvestSeason,
        SupplierName = order.SupplierName,
        TotalCost = order.TotalCost,
        Note = order.Note,
        DocumentImages = order.DocumentImages,
        Status = order.Status.ToString(),
        ImportedAt = order.ImportedAt,
        CreatedAt = order.CreatedAt,
        Items = order.Items.Select(i => new ImportOrderItemResponse
        {
            Id = i.Id,
            VariantId = i.VariantId,
            VariantName = i.Variant?.Name ?? string.Empty,
            BatchCode = i.BatchCode,
            Quantity = i.Quantity,
            RemainingQty = i.RemainingQty,
            CostPrice = i.CostPrice,
            ManufacturedAt = i.ManufacturedAt,
            ExpiredAt = i.ExpiredAt,
            Status = i.Status.ToString()
        }).ToList()
    };
}
