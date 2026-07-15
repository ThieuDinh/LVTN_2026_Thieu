namespace NongSan.Application.DTOs.Cart;

public class CartResponse
{
    public int Id { get; set; }
    public List<CartItemResponse> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public int TotalItems { get; set; }
}

public class CartItemResponse
{
    public int Id { get; set; }
    public int VariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string VariantName { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
    public int Stock { get; set; }
    public string? Images { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public int ShopId { get; set; }
}
