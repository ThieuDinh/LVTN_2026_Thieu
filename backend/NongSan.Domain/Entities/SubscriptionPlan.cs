using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class SubscriptionPlan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public decimal CommissionRate { get; set; }
    public int MaxProducts { get; set; }
    public int BoostScore { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<ShopSubscription> ShopSubscriptions { get; set; } = new List<ShopSubscription>();
}
