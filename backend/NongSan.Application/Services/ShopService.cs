using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Shop;
using NongSan.Application.Interfaces;
using NongSan.Domain.Entities;
using NongSan.Domain.Enums;

namespace NongSan.Application.Services;

public class ShopService : IShopService
{
    private readonly IAppDbContext _context;

    public ShopService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ShopResponse>> CreateAsync(int userId, CreateShopRequest request)
    {
        // Kiểm tra user đã có shop chưa
        var existingShop = await _context.Shops
            .AnyAsync(s => s.OwnerId == userId);

        if (existingShop)
            return Result<ShopResponse>.Fail("Bạn đã có shop, không thể tạo thêm.");

        // Cập nhật role user thành Seller
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return Result<ShopResponse>.Fail("Người dùng không tồn tại.");

        var slug = SlugHelper.GenerateSlug(request.Name);

        // Kiểm tra slug trùng
        var slugExists = await _context.Shops.AnyAsync(s => s.Slug == slug);
        if (slugExists)
            slug = $"{slug}-{DateTime.UtcNow.Ticks}";

        var shop = new Shop
        {
            OwnerId = userId,
            Name = request.Name.Trim(),
            Slug = slug,
            Logo = request.Logo,
            Description = request.Description,
            Province = request.Province?.Trim(),
            Status = ShopStatus.Pending,
            CommissionRate = 0.05m
        };

        _context.Shops.Add(shop);

        // Nâng role lên Seller
        user.Role = UserRole.Seller;

        await _context.SaveChangesAsync();

        return Result<ShopResponse>.Ok(MapToResponse(shop));
    }

    public async Task<Result<ShopResponse>> UpdateAsync(int shopId, int userId, UpdateShopRequest request)
    {
        var shop = await _context.Shops
            .FirstOrDefaultAsync(s => s.Id == shopId && s.OwnerId == userId);

        if (shop == null)
            return Result<ShopResponse>.Fail("Shop không tồn tại hoặc bạn không có quyền.");

        shop.Name = request.Name.Trim();
        shop.Logo = request.Logo;
        shop.Description = request.Description;
        shop.Province = request.Province?.Trim();

        // Cập nhật slug nếu đổi tên
        var newSlug = SlugHelper.GenerateSlug(request.Name);
        if (newSlug != shop.Slug)
        {
            var slugExists = await _context.Shops
                .AnyAsync(s => s.Slug == newSlug && s.Id != shopId);
            shop.Slug = slugExists ? $"{newSlug}-{DateTime.UtcNow.Ticks}" : newSlug;
        }

        await _context.SaveChangesAsync();

        return Result<ShopResponse>.Ok(MapToResponse(shop));
    }

    public async Task<Result<ShopResponse>> GetMyShopAsync(int userId)
    {
        var shop = await _context.Shops
            .FirstOrDefaultAsync(s => s.OwnerId == userId);

        if (shop == null)
            return Result<ShopResponse>.Fail("Bạn chưa có shop.");

        return Result<ShopResponse>.Ok(MapToResponse(shop));
    }

    private static ShopResponse MapToResponse(Shop shop) => new()
    {
        Id = shop.Id,
        OwnerId = shop.OwnerId,
        Name = shop.Name,
        Slug = shop.Slug,
        Logo = shop.Logo,
        Description = shop.Description,
        Province = shop.Province,
        Status = shop.Status.ToString(),
        CommissionRate = shop.CommissionRate,
        Rating = shop.Rating,
        CreatedAt = shop.CreatedAt
    };
}
