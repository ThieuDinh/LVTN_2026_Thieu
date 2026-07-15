using NongSan.Application.Common;
using NongSan.Application.DTOs.Cart;

namespace NongSan.Application.Interfaces;

public interface ICartService
{
    Task<Result<CartResponse>> GetCartAsync(int userId);
    Task<Result<CartResponse>> AddItemAsync(int userId, AddCartItemRequest request);
    Task<Result<CartResponse>> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemRequest request);
    Task<Result<CartResponse>> RemoveItemAsync(int userId, int cartItemId);
    Task<Result<bool>> ClearCartAsync(int userId);
}
