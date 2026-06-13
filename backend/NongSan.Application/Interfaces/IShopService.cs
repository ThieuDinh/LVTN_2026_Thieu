using NongSan.Application.Common;
using NongSan.Application.DTOs.Shop;

namespace NongSan.Application.Interfaces;

public interface IShopService
{
    Task<Result<ShopResponse>> CreateAsync(int userId, CreateShopRequest request);
    Task<Result<ShopResponse>> UpdateAsync(int shopId, int userId, UpdateShopRequest request);
    Task<Result<ShopResponse>> GetMyShopAsync(int userId);
}
