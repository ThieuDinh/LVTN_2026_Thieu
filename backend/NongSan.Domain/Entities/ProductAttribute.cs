using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class ProductAttribute : BaseEntity
{
    public int ProductId { get; set; }
    public string AttrName { get; set; } = string.Empty;
    public string AttrValue { get; set; } = string.Empty;

    public Product Product { get; set; } = null!;
}

