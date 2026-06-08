using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class CartItem : BaseEntity
{
    public int CartId { get; set; }
    public int VariantId { get; set; }
    public int Quantity { get; set; }

    public Cart Cart { get; set; } = null!;
    public ProductVariant Variant { get; set; } = null!;
}
