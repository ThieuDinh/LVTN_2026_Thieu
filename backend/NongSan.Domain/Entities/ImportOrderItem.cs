using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class ImportOrderItem : BaseEntity
{
    public int ImportOrderId { get; set; }
    public int VariantId { get; set; }
    public string BatchCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int RemainingQty { get; set; }
    public decimal CostPrice { get; set; }
    public DateTime ManufacturedAt { get; set; }
    public DateTime ExpiredAt { get; set; }
    public ImportOrderItemStatus Status { get; set; } = ImportOrderItemStatus.Active;

    public ImportOrder ImportOrder { get; set; } = null!;
    public ProductVariant Variant { get; set; } = null!;
    public ICollection<OrderItemBatch> OrderItemBatches { get; set; } = new List<OrderItemBatch>();
}

