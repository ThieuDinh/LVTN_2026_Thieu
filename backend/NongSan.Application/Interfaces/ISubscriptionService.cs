using NongSan.Application.Common;
using NongSan.Application.DTOs.Subscription;

namespace NongSan.Application.Interfaces;

public interface ISubscriptionService
{
    Task<Result<List<SubscriptionPlanDto>>> GetAllPlansAsync();
    Task<Result<ShopSubscriptionDto>> GetCurrentSubscriptionAsync(int shopId);
    Task<Result<ShopSubscriptionDto>> RegisterAsync(RegisterShopSubscriptionRequest request);
}
