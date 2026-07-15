using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Cart;
using NongSan.Application.Interfaces;
using NongSan.Domain.Entities;

namespace NongSan.Application.Services;

public class CartService : ICartService
{
    private readonly IAppDbContext _context;

    public CartService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CartResponse>> GetCartAsync(int userId)
    {
        var cart = await GetOrCreateCartAsync(userId);

        var cartWithItems = await _context.Carts
            .AsNoTracking()
            .Include(c => c.Items)
                .ThenInclude(ci => ci.Variant)
                    .ThenInclude(v => v.Product)
                        .ThenInclude(p => p.Shop)
            .FirstOrDefaultAsync(c => c.Id == cart.Id);

        return Result<CartResponse>.Ok(MapToResponse(cartWithItems!));
    }

    public async Task<Result<CartResponse>> AddItemAsync(int userId, AddCartItemRequest request)
    {
        // Kiểm tra variant tồn tại và đang bán
        var variant = await _context.ProductVariants
            .Include(v => v.Product)
            .FirstOrDefaultAsync(v => v.Id == request.VariantId
                && v.Product.Status == Domain.Enums.ProductStatus.Active);

        if (variant == null)
            return Result<CartResponse>.Fail("Sản phẩm không tồn tại hoặc đã ngừng bán.");

        if (variant.Stock < request.Quantity)
            return Result<CartResponse>.Fail($"Tồn kho không đủ. Còn lại: {variant.Stock}");

        var cart = await GetOrCreateCartAsync(userId);

        // Kiểm tra đã có trong giỏ chưa
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.VariantId == request.VariantId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;

            if (existingItem.Quantity > variant.Stock)
                return Result<CartResponse>.Fail($"Tổng số lượng vượt tồn kho. Còn lại: {variant.Stock}");
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                VariantId = request.VariantId,
                Quantity = request.Quantity
            };
            _context.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<Result<CartResponse>> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemRequest request)
    {
        var cart = await GetOrCreateCartAsync(userId);

        var cartItem = await _context.CartItems
            .Include(ci => ci.Variant)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);

        if (cartItem == null)
            return Result<CartResponse>.Fail("Sản phẩm không có trong giỏ hàng.");

        if (request.Quantity <= 0)
            return Result<CartResponse>.Fail("Số lượng phải lớn hơn 0.");

        if (request.Quantity > cartItem.Variant.Stock)
            return Result<CartResponse>.Fail($"Tồn kho không đủ. Còn lại: {cartItem.Variant.Stock}");

        cartItem.Quantity = request.Quantity;
        await _context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<Result<CartResponse>> RemoveItemAsync(int userId, int cartItemId)
    {
        var cart = await GetOrCreateCartAsync(userId);

        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);

        if (cartItem == null)
            return Result<CartResponse>.Fail("Sản phẩm không có trong giỏ hàng.");

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<Result<bool>> ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return Result<bool>.Ok(true);

        foreach (var item in cart.Items.ToList())
            _context.CartItems.Remove(item);

        await _context.SaveChangesAsync();

        return Result<bool>.Ok(true);
    }

    private async Task<Cart> GetOrCreateCartAsync(int userId)
    {
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    private static CartResponse MapToResponse(Cart cart) => new()
    {
        Id = cart.Id,
        Items = cart.Items
            .Where(ci => ci.Variant != null && ci.Variant.Product != null && ci.Variant.Product.Shop != null)
            .Select(ci => new CartItemResponse
        {
            Id = ci.Id,
            VariantId = ci.VariantId,
            ProductName = ci.Variant.Product!.Name,
            VariantName = ci.Variant.Name,
            SKU = ci.Variant.SKU,
            Price = ci.Variant.Price,
            Quantity = ci.Quantity,
            LineTotal = ci.Variant.Price * ci.Quantity,
            Stock = ci.Variant.Stock,
            Images = ci.Variant.Images,
            ShopName = ci.Variant.Product.Shop!.Name,
            ShopId = ci.Variant.Product.ShopId
        }).ToList(),
        TotalAmount = cart.Items
            .Where(ci => ci.Variant != null && ci.Variant.Product != null && ci.Variant.Product.Shop != null)
            .Sum(ci => ci.Variant!.Price * ci.Quantity),
        TotalItems = cart.Items
            .Where(ci => ci.Variant != null && ci.Variant.Product != null && ci.Variant.Product.Shop != null)
            .Sum(ci => ci.Quantity)
    };
}
