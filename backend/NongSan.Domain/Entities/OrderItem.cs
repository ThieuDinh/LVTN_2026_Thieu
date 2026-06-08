using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class OrderItem : BaseEntity
{
    public int ShopOrderId { get; set; }
    public int VariantId { get; set; }
    public string SnapshotName { get; set; } = string.Empty;
    public string SnapshotSKU { get; set; } = string.Empty;
    public decimal SnapshotPrice { get; set; }
    public string? SnapshotImage { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }

    public ShopOrder ShopOrder { get; set; } = null!;
    public ProductVariant Variant { get; set; } = null!;
    public ICollection<OrderItemBatch> OrderItemBatches { get; set; } = new List<OrderItemBatch>();
    public Review? Review { get; set; }
}
