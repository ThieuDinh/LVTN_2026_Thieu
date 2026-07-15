namespace NongSan.Application.DTOs.Order;

public class OrderResponse
{
    public int Id { get; set; }
    public int BuyerId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal GrandTotal { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ShopOrderResponse> ShopOrders { get; set; } = new();
}

public class ShopOrderResponse
{
    public int Id { get; set; }
    public int ShopId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string ShipReceiverName { get; set; } = string.Empty;
    public string ShipPhone { get; set; } = string.Empty;
    public string ShipAddress { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? TrackingCode { get; set; }
    public string? CancelledReason { get; set; }
    public string? CancelledBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
}

public class OrderItemResponse
{
    public int Id { get; set; }
    public int VariantId { get; set; }
    public string SnapshotName { get; set; } = string.Empty;
    public string SnapshotSKU { get; set; } = string.Empty;
    public decimal SnapshotPrice { get; set; }
    public string? SnapshotImage { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}
