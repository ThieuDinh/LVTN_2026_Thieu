using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Product;
using NongSan.Application.Interfaces;
using NongSan.Domain.Entities;
using NongSan.Domain.Enums;

namespace NongSan.Application.Services;

public class ProductService : IProductService
{
    private readonly IAppDbContext _context;

    public ProductService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductResponse>> CreateAsync(int shopId, CreateProductRequest request)
    {
        // Kiểm tra shop đang hoạt động
        var shop = await _context.Shops.FindAsync(shopId);
        if (shop == null || shop.Status != ShopStatus.Active)
            return Result<ProductResponse>.Fail("Shop chưa được duyệt hoặc đang bị tạm ngưng.");

        // Kiểm tra giới hạn sản phẩm theo gói đăng ký
        var now = DateTime.UtcNow;
        var activeSubscription = await _context.ShopSubscriptions
            .Include(s => s.Plan)
            .Where(s => s.ShopId == shopId
                && s.Status == ShopSubscriptionStatus.Active
                && s.EndDate > now)
            .OrderByDescending(s => s.EndDate)
            .FirstOrDefaultAsync();

        var maxProducts = activeSubscription?.Plan.MaxProducts ?? 20; // Mặc định gói Cơ bản
        if (maxProducts != -1) // -1 = không giới hạn
        {
            var currentProductCount = await _context.Products
                .CountAsync(p => p.ShopId == shopId && p.DeletedAt == null);

            if (currentProductCount >= maxProducts)
                return Result<ProductResponse>.Fail(
                    $"Shop đã đạt giới hạn {maxProducts} sản phẩm của gói {activeSubscription?.Plan.Name ?? "Cơ bản"}. " +
                    "Vui lòng nâng cấp gói để thêm sản phẩm.");
        }

        // Kiểm tra category tồn tại
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == request.CategoryId);

        if (!categoryExists)
            return Result<ProductResponse>.Fail("Danh mục không tồn tại.");

        // Kiểm tra SKU trùng
        var skuList = request.Variants.Select(v => v.SKU).ToList();
        var existingSku = await _context.ProductVariants
            .AnyAsync(v => skuList.Contains(v.SKU));

        if (existingSku)
            return Result<ProductResponse>.Fail("Một hoặc nhiều SKU đã tồn tại.");

        var slug = SlugHelper.GenerateSlug(request.Name);
        var slugExists = await _context.Products.AnyAsync(p => p.Slug == slug);
        if (slugExists)
            slug = $"{slug}-{DateTime.UtcNow.Ticks}";

        var product = new Product
        {
            ShopId = shopId,
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description,
            Unit = request.Unit.Trim(),
            BasePrice = request.BasePrice
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Thêm variants
        foreach (var v in request.Variants)
        {
            var variant = new ProductVariant
            {
                ProductId = product.Id,
                Name = v.Name.Trim(),
                Price = v.Price,
                Stock = 0,
                SKU = v.SKU.Trim(),
                Images = v.Images
            };
            _context.ProductVariants.Add(variant);
        }

        // Thêm attributes
        foreach (var a in request.Attributes)
        {
            var attr = new ProductAttribute
            {
                ProductId = product.Id,
                AttrName = a.AttrName.Trim(),
                AttrValue = a.AttrValue.Trim()
            };
            _context.ProductAttributes.Add(attr);
        }

        await _context.SaveChangesAsync();

        // Load lại product đầy đủ
        return await GetByIdAsync(product.Id);
    }

    public async Task<Result<ProductResponse>> UpdateAsync(int productId, int shopId, UpdateProductRequest request)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && p.ShopId == shopId);

        if (product == null)
            return Result<ProductResponse>.Fail("Sản phẩm không tồn tại hoặc bạn không có quyền.");

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == request.CategoryId);

        if (!categoryExists)
            return Result<ProductResponse>.Fail("Danh mục không tồn tại.");

        product.CategoryId = request.CategoryId;
        product.Name = request.Name.Trim();
        product.Description = request.Description;
        product.Unit = request.Unit.Trim();
        product.BasePrice = request.BasePrice;

        // Cập nhật slug nếu đổi tên
        var newSlug = SlugHelper.GenerateSlug(request.Name);
        if (newSlug != product.Slug)
        {
            var slugExists = await _context.Products
                .AnyAsync(p => p.Slug == newSlug && p.Id != productId);
            product.Slug = slugExists ? $"{newSlug}-{DateTime.UtcNow.Ticks}" : newSlug;
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(productId);
    }

    public async Task<Result<ProductResponse>> GetByIdAsync(int productId)
    {
        var product = await _context.Products
            .Include(p => p.Variants)
            .Include(p => p.Attributes)
            .Include(p => p.Shop)
                .ThenInclude(s => s.ShopSubscriptions.Where(ss => ss.Status == ShopSubscriptionStatus.Active))
                .ThenInclude(ss => ss.Plan)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return Result<ProductResponse>.Fail("Sản phẩm không tồn tại.");

        return Result<ProductResponse>.Ok(MapToResponse(product));
    }

    public async Task<Result<List<ProductResponse>>> GetByShopAsync(int shopId)
    {
        var products = await _context.Products
            .Include(p => p.Variants)
            .Include(p => p.Attributes)
            .Include(p => p.Shop)
                .ThenInclude(s => s.ShopSubscriptions.Where(ss => ss.Status == ShopSubscriptionStatus.Active))
                .ThenInclude(ss => ss.Plan)
            .Where(p => p.ShopId == shopId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var response = products.Select(MapToResponse).ToList();
        return Result<List<ProductResponse>>.Ok(response);
    }

    public async Task<Result<bool>> DeleteAsync(int productId, int shopId)
    {
        var product = await _context.Products
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == productId && p.ShopId == shopId);

        if (product == null)
            return Result<bool>.Fail("Sản phẩm không tồn tại hoặc bạn không có quyền.");

        // Kiểm tra có đơn hàng đang xử lý không
        var variantIds = product.Variants.Select(v => v.Id).ToList();
        var hasActiveOrders = await _context.OrderItems
            .AnyAsync(oi => variantIds.Contains(oi.VariantId)
                && oi.ShopOrder.Status != ShopOrderStatus.Delivered
                && oi.ShopOrder.Status != ShopOrderStatus.Cancelled);

        if (hasActiveOrders)
            return Result<bool>.Fail("Không thể xóa sản phẩm đang có đơn hàng xử lý.");

        // Soft delete
        product.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result<bool>.Ok(true);
    }

    public async Task<Result<ProductResponse>> ToggleStatusAsync(int productId, int shopId)
    {
        var product = await _context.Products
            .Include(p => p.Variants)
            .Include(p => p.Attributes)
            .FirstOrDefaultAsync(p => p.Id == productId && p.ShopId == shopId);

        if (product == null)
            return Result<ProductResponse>.Fail("Sản phẩm không tồn tại hoặc bạn không có quyền.");

        product.Status = product.Status == ProductStatus.Active
            ? ProductStatus.Draft
            : ProductStatus.Active;

        await _context.SaveChangesAsync();

        return Result<ProductResponse>.Ok(MapToResponse(product));
    }

    public async Task<Result<PagedResult<ProductResponse>>> SearchAsync(ProductSearchRequest request)
    {
        var now = DateTime.UtcNow;

        var query = _context.Products
            .Include(p => p.Variants)
            .Include(p => p.Attributes)
            .Include(p => p.Shop)
                .ThenInclude(s => s.ShopSubscriptions.Where(ss => ss.Status == ShopSubscriptionStatus.Active))
                .ThenInclude(ss => ss.Plan)
            .Where(p => p.Status == ProductStatus.Active)
            .AsQueryable();

        // Lọc theo keyword
        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(keyword) ||
                (p.Description != null && p.Description.ToLower().Contains(keyword)));
        }

        // Lọc theo danh mục
        if (request.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);

        // Lọc theo khoảng giá
        if (request.MinPrice.HasValue)
            query = query.Where(p => p.BasePrice >= request.MinPrice.Value);

        if (request.MaxPrice.HasValue)
            query = query.Where(p => p.BasePrice <= request.MaxPrice.Value);

        // Sắp xếp
        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDescending
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name),
            "price" => request.SortDescending
                ? query.OrderByDescending(p => p.BasePrice)
                : query.OrderBy(p => p.BasePrice),
            "bestseller" => query.OrderByDescending(p => p.TotalSold),
            "boost" => query.OrderByDescending(p =>
                p.TotalSold +
                (p.Shop.ShopSubscriptions
                    .Where(s => s.Status == ShopSubscriptionStatus.Active && s.EndDate > now)
                    .Select(s => s.Plan.BoostScore)
                    .FirstOrDefault())),
            _ => query.OrderByDescending(p =>
                p.TotalSold +
                (p.Shop.ShopSubscriptions
                    .Where(s => s.Status == ShopSubscriptionStatus.Active && s.EndDate > now)
                    .Select(s => s.Plan.BoostScore)
                    .FirstOrDefault()))
        };

        var totalCount = await query.CountAsync();

        var products = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var result = new PagedResult<ProductResponse>
        {
            Items = products.Select(MapToResponse).ToList(),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };

        return Result<PagedResult<ProductResponse>>.Ok(result);
    }

    private static ProductResponse MapToResponse(Product product)
    {
        var now = DateTime.UtcNow;

        // Lấy subscription active của shop (nếu đã include)
        ProductSubscriptionInfo? subscriptionInfo = null;
        if (product.Shop?.ShopSubscriptions != null)
        {
            var activeSub = product.Shop.ShopSubscriptions
                .Where(s => s.Status == ShopSubscriptionStatus.Active && s.EndDate > now)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefault();

            if (activeSub?.Plan != null && activeSub.Plan.BoostScore > 0)
            {
                subscriptionInfo = new ProductSubscriptionInfo
                {
                    PlanName = activeSub.Plan.Name,
                    BoostScore = activeSub.Plan.BoostScore
                };
            }
        }

        return new ProductResponse
        {
            Id = product.Id,
            ShopId = product.ShopId,
            CategoryId = product.CategoryId,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Unit = product.Unit,
            BasePrice = product.BasePrice,
            Status = product.Status.ToString(),
            TotalSold = product.TotalSold,
            CreatedAt = product.CreatedAt,
            Subscription = subscriptionInfo,
            Variants = product.Variants.Select(v => new ProductVariantResponse
            {
                Id = v.Id,
                Name = v.Name,
                Price = v.Price,
                Stock = v.Stock,
                SKU = v.SKU,
                Images = v.Images
            }).ToList(),
            Attributes = product.Attributes.Select(a => new ProductAttributeResponse
            {
                Id = a.Id,
                AttrName = a.AttrName,
                AttrValue = a.AttrValue
            }).ToList()
        };
    }
}
