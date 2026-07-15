namespace NongSan.Application.DTOs.Product;

public class ProductResponse
{
    public int Id { get; set; }
    public int ShopId { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalSold { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ProductVariantResponse> Variants { get; set; } = new();
    public List<ProductAttributeResponse> Attributes { get; set; } = new();
    public ProductSubscriptionInfo? Subscription { get; set; }
}

public class ProductSubscriptionInfo
{
    public string PlanName { get; set; } = string.Empty;
    public int BoostScore { get; set; }
}

public class ProductVariantResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string? Images { get; set; }
}

public class ProductAttributeResponse
{
    public int Id { get; set; }
    public string AttrName { get; set; } = string.Empty;
    public string AttrValue { get; set; } = string.Empty;
}
