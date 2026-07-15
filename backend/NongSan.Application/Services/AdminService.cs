using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Admin;
using NongSan.Application.Interfaces;
using NongSan.Domain.Enums;

namespace NongSan.Application.Services;

public class AdminService : IAdminService
{
    private readonly IAppDbContext _context;

    public AdminService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AdminStatsResponse>> GetStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalBuyers = await _context.Users.CountAsync(u => u.Role == UserRole.Buyer);
        var totalSellers = await _context.Users.CountAsync(u => u.Role == UserRole.Seller);
        var totalShops = await _context.Shops.CountAsync();
        var pendingShops = await _context.Shops.CountAsync(s => s.Status == ShopStatus.Pending);
        var totalProducts = await _context.Products.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.PlatformRevenues.SumAsync(r => (decimal?)r.CommissionAmount) ?? 0;

        return Result<AdminStatsResponse>.Ok(new AdminStatsResponse
        {
            TotalUsers = totalUsers,
            TotalBuyers = totalBuyers,
            TotalSellers = totalSellers,
            TotalShops = totalShops,
            PendingShops = pendingShops,
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue
        });
    }

    // ─── SHOP ──────────────────────────────────────────────────────────────────

    public async Task<Result<List<AdminShopResponse>>> GetAllShopsAsync(string? status)
    {
        var query = _context.Shops
            .Include(s => s.Owner)
            .Include(s => s.Products)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<ShopStatus>(status, true, out var shopStatus))
        {
            query = query.Where(s => s.Status == shopStatus);
        }

        var shops = await query.OrderByDescending(s => s.CreatedAt).ToListAsync();

        var result = shops.Select(s => MapShopToResponse(s)).ToList();
        return Result<List<AdminShopResponse>>.Ok(result);
    }

    public async Task<Result<AdminShopResponse>> ApproveShopAsync(int shopId)
    {
        var shop = await _context.Shops
            .Include(s => s.Owner)
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == shopId);

        if (shop == null)
            return Result<AdminShopResponse>.Fail("Gian hàng không tồn tại.");

        if (shop.Status == ShopStatus.Active)
            return Result<AdminShopResponse>.Fail("Gian hàng đã được duyệt trước đó.");

        shop.Status = ShopStatus.Active;
        
        if (shop.Owner != null)
        {
            shop.Owner.Role = UserRole.Seller;
        }

        await _context.SaveChangesAsync();

        return Result<AdminShopResponse>.Ok(MapShopToResponse(shop));
    }

    public async Task<Result<AdminShopResponse>> SuspendShopAsync(int shopId)
    {
        var shop = await _context.Shops
            .Include(s => s.Owner)
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == shopId);

        if (shop == null)
            return Result<AdminShopResponse>.Fail("Gian hàng không tồn tại.");

        shop.Status = shop.Status == ShopStatus.Suspended
            ? ShopStatus.Active
            : ShopStatus.Suspended;

        await _context.SaveChangesAsync();

        return Result<AdminShopResponse>.Ok(MapShopToResponse(shop));
    }

    public async Task<Result<AdminShopResponse>> UpdateCommissionAsync(int shopId, UpdateCommissionRequest request)
    {
        if (request.CommissionRate < 0 || request.CommissionRate > 1)
            return Result<AdminShopResponse>.Fail("Tỷ lệ hoa hồng phải từ 0 đến 1 (0% - 100%).");

        var shop = await _context.Shops
            .Include(s => s.Owner)
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == shopId);

        if (shop == null)
            return Result<AdminShopResponse>.Fail("Gian hàng không tồn tại.");

        shop.CommissionRate = request.CommissionRate;
        await _context.SaveChangesAsync();

        return Result<AdminShopResponse>.Ok(MapShopToResponse(shop));
    }

    // ─── USER ───────────────────────────────────────────────────────────────────

    public async Task<Result<List<AdminUserResponse>>> GetAllUsersAsync(string? role)
    {
        var query = _context.Users
            .Include(u => u.Shop)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(role) &&
            Enum.TryParse<UserRole>(role, true, out var userRole))
        {
            query = query.Where(u => u.Role == userRole);
        }

        var users = await query.OrderByDescending(u => u.CreatedAt).ToListAsync();

        var result = users.Select(u => new AdminUserResponse
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            ShopId = u.Shop?.Id,
            ShopName = u.Shop?.Name
        }).ToList();

        return Result<List<AdminUserResponse>>.Ok(result);
    }

    public async Task<Result<AdminUserResponse>> LockUserAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Shop)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return Result<AdminUserResponse>.Fail("Người dùng không tồn tại.");

        if (user.Role == UserRole.Admin)
            return Result<AdminUserResponse>.Fail("Không thể khoá tài khoản Admin.");

        user.IsActive = false;
        await _context.SaveChangesAsync();

        return Result<AdminUserResponse>.Ok(MapUserToResponse(user));
    }

    public async Task<Result<AdminUserResponse>> UnlockUserAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Shop)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return Result<AdminUserResponse>.Fail("Người dùng không tồn tại.");

        user.IsActive = true;
        await _context.SaveChangesAsync();

        return Result<AdminUserResponse>.Ok(MapUserToResponse(user));
    }

    // ─── HELPERS ────────────────────────────────────────────────────────────────

    private static AdminShopResponse MapShopToResponse(Domain.Entities.Shop shop) => new()
    {
        Id = shop.Id,
        Name = shop.Name,
        Slug = shop.Slug,
        Logo = shop.Logo,
        Province = shop.Province,
        Status = shop.Status.ToString(),
        CommissionRate = shop.CommissionRate,
        Rating = shop.Rating,
        CreatedAt = shop.CreatedAt,
        TotalProducts = shop.Products?.Count ?? 0,
        OwnerId = shop.OwnerId,
        OwnerName = shop.Owner?.FullName ?? string.Empty,
        OwnerEmail = shop.Owner?.Email ?? string.Empty
    };

    private static AdminUserResponse MapUserToResponse(Domain.Entities.User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Phone = user.Phone,
        Role = user.Role.ToString(),
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt,
        ShopId = user.Shop?.Id,
        ShopName = user.Shop?.Name
    };
}
