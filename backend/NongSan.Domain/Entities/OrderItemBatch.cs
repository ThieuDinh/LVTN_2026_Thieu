using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class OrderItemBatch : BaseEntity
{
    public int OrderItemId { get; set; }
    public int ImportOrderItemId { get; set; }
    public int QuantityUsed { get; set; }
    public string ExpirySnapshot { get; set; } = string.Empty;

    public OrderItem OrderItem { get; set; } = null!;
    public ImportOrderItem ImportOrderItem { get; set; } = null!;
}
