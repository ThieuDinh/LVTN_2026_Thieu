namespace NongSan.Application.DTOs.Subscription;

public class RegisterShopSubscriptionRequest
{
    public int ShopId { get; set; }
    public int PlanId { get; set; }
    public int DurationMonths { get; set; }
}
