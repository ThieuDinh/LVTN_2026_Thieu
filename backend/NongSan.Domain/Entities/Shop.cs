using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class Shop : BaseEntity
{
    public int OwnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Description { get; set; }
    public string? Province { get; set; }
    public ShopStatus Status { get; set; } = ShopStatus.Pending;
    public decimal CommissionRate { get; set; } = 0.05m;
    public float Rating { get; set; } = 0;

    public User Owner { get; set; } = null!;
    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<ImportOrder> ImportOrders { get; set; } = new List<ImportOrder>();
    public ICollection<ShopOrder> ShopOrders { get; set; } = new List<ShopOrder>();
    public ICollection<PlatformRevenue> PlatformRevenues { get; set; } = new List<PlatformRevenue>();
}

