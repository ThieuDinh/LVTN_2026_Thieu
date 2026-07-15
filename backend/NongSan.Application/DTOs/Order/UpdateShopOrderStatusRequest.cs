namespace NongSan.Application.DTOs.Order;

public class ConfirmShopOrderRequest
{
    // Seller xác nhận đơn hàng — không cần thêm data
}

public class ShipShopOrderRequest
{
    public string? TrackingCode { get; set; }
}
