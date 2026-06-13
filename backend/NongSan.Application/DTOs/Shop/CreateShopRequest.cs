namespace NongSan.Application.DTOs.Shop;

public class CreateShopRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Description { get; set; }
    public string? Province { get; set; }
}
