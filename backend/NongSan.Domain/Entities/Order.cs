using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class Order : BaseEntity
{
    public int BuyerId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public decimal GrandTotal { get; set; }
    public string? Note { get; set; }

    public User Buyer { get; set; } = null!;
    public ICollection<ShopOrder> ShopOrders { get; set; } = new List<ShopOrder>();
    public Payment? Payment { get; set; }
}
