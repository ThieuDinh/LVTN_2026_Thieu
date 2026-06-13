namespace NongSan.Application.DTOs.ImportOrder;

public class ImportOrderResponse
{
    public int Id { get; set; }
    public int ShopId { get; set; }
    public string ImportCode { get; set; } = string.Empty;
    public string? HarvestSeason { get; set; }
    public string? SupplierName { get; set; }
    public decimal TotalCost { get; set; }
    public string? Note { get; set; }
    public string? DocumentImages { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime ImportedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ImportOrderItemResponse> Items { get; set; } = new();
}

public class ImportOrderItemResponse
{
    public int Id { get; set; }
    public int VariantId { get; set; }
    public string VariantName { get; set; } = string.Empty;
    public string BatchCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int RemainingQty { get; set; }
    public decimal CostPrice { get; set; }
    public DateTime ManufacturedAt { get; set; }
    public DateTime ExpiredAt { get; set; }
    public string Status { get; set; } = string.Empty;
}
