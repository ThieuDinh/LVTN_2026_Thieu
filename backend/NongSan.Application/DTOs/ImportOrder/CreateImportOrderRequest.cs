namespace NongSan.Application.DTOs.ImportOrder;

public class CreateImportOrderRequest
{
    public string ImportCode { get; set; } = string.Empty;
    public string? HarvestSeason { get; set; }
    public string? SupplierName { get; set; }
    public string? Note { get; set; }
    public string? DocumentImages { get; set; }
    public List<CreateImportOrderItemRequest> Items { get; set; } = new();
}

public class CreateImportOrderItemRequest
{
    public int VariantId { get; set; }
    public string BatchCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }
    public DateTime ManufacturedAt { get; set; }
    public DateTime ExpiredAt { get; set; }
}
