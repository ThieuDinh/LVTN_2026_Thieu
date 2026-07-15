namespace NongSan.Application.DTOs.Order;

public class CheckoutRequest
{
    public int AddressId { get; set; }
    public string PaymentMethod { get; set; } = "COD";
    public string? Note { get; set; }
}
