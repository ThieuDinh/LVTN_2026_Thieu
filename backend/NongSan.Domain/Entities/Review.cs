using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class Review : BaseEntity
{
    public int BuyerId { get; set; }
    public int ProductId { get; set; }
    public int OrderItemId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public string? Images { get; set; }

    public User Buyer { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public OrderItem OrderItem { get; set; } = null!;
}

