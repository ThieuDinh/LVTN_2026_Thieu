using NongSan.Domain.Common;
using NongSan.Domain.Enums;

namespace NongSan.Domain.Entities;

public class ImportOrder : BaseEntity
{
    public int ShopId { get; set; }
    public string ImportCode { get; set; } = string.Empty;
    public string? HarvestSeason { get; set; }
    public string? SupplierName { get; set; }
    public decimal TotalCost { get; set; } = 0;
    public string? Note { get; set; }
    public string? DocumentImages { get; set; }
    public ImportOrderStatus Status { get; set; } = ImportOrderStatus.Draft;
    public DateTime ImportedAt { get; set; } = DateTime.UtcNow;

    public Shop Shop { get; set; } = null!;
    public ICollection<ImportOrderItem> Items { get; set; } = new List<ImportOrderItem>();
}

