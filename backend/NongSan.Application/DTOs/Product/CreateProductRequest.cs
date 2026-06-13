namespace NongSan.Application.DTOs.Product;

public class CreateProductRequest
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public List<CreateVariantRequest> Variants { get; set; } = new();
    public List<CreateAttributeRequest> Attributes { get; set; } = new();
}

public class CreateVariantRequest
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string? Images { get; set; }
}

public class CreateAttributeRequest
{
    public string AttrName { get; set; } = string.Empty;
    public string AttrValue { get; set; } = string.Empty;
}
