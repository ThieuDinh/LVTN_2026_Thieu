using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class ShopSubscription : BaseEntity
{
    public int ShopId { get; set; }
    public int PlanId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ShopSubscriptionStatus Status { get; set; } = ShopSubscriptionStatus.Active;

    public Shop Shop { get; set; } = null!;
    public SubscriptionPlan Plan { get; set; } = null!;
}
