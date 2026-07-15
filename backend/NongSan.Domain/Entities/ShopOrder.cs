using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class ShopOrder : BaseEntity
{
    public int OrderId { get; set; }
    public int ShopId { get; set; }
    public string ShipReceiverName { get; set; } = string.Empty;
    public string ShipPhone { get; set; } = string.Empty;
    public string ShipProvince { get; set; } = string.Empty;
    public string ShipDistrict { get; set; } = string.Empty;
    public string ShipWard { get; set; } = string.Empty;
    public string ShipDetail { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public ShopOrderStatus Status { get; set; } = ShopOrderStatus.Pending;
    public string? TrackingCode { get; set; }
    public string? CancelledReason { get; set; }
    public string? CancelledBy { get; set; } // "Buyer" hoặc "Seller"

    public Order Order { get; set; } = null!;
    public Shop Shop { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public PlatformRevenue? PlatformRevenue { get; set; }
}
