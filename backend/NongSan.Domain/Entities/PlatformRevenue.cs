using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class PlatformRevenue : BaseEntity
{
    public int ShopOrderId { get; set; }
    public int ShopId { get; set; }
    public decimal OrderTotal { get; set; }
    public decimal CommissionRate { get; set; }
    public decimal CommissionAmount { get; set; }
    public RevenueStatus Status { get; set; } = RevenueStatus.Pending;

    public ShopOrder ShopOrder { get; set; } = null!;
    public Shop Shop { get; set; } = null!;
}
