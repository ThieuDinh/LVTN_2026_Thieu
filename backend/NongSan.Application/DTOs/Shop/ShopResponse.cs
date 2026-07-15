namespace NongSan.Application.DTOs.Shop;

public class ShopResponse
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Description { get; set; }
    public string? Province { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal CommissionRate { get; set; }
    public float Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalProducts { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public string? NewToken { get; set; }
}
