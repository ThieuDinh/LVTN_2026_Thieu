using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; } = 0;
    public string SKU { get; set; } = string.Empty;
    public string? Images { get; set; }

    public Product Product { get; set; } = null!;
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<ImportOrderItem> ImportOrderItems { get; set; } = new List<ImportOrderItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

