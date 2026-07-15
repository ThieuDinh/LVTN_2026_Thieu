namespace NongSan.Application.DTOs.Order;

/// <summary>
/// Response cho seller xem chi tiết đơn hàng shop
/// </summary>
public class ShopOrderDetailResponse
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ShopId { get; set; }

    // Thông tin buyer
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public string? BuyerPhone { get; set; }

    // Thông tin giao hàng
    public string ShipReceiverName { get; set; } = string.Empty;
    public string ShipPhone { get; set; } = string.Empty;
    public string ShipAddress { get; set; } = string.Empty;

    // Thông tin đơn hàng
    public decimal SubTotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? TrackingCode { get; set; }
    public string? Note { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;

    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<OrderItemResponse> Items { get; set; } = new();
}

/// <summary>
/// Response cho seller xem danh sách đơn hàng (tóm tắt)
/// </summary>
public class ShopOrderSummaryResponse
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public string ShipReceiverName { get; set; } = string.Empty;
    public string ShipPhone { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public int TotalItems { get; set; }
    public DateTime CreatedAt { get; set; }
}
