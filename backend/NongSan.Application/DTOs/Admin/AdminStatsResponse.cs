namespace NongSan.Application.DTOs.Admin;

public class AdminStatsResponse
{
    public int TotalUsers { get; set; }
    public int TotalBuyers { get; set; }
    public int TotalSellers { get; set; }
    public int TotalShops { get; set; }
    public int PendingShops { get; set; }
    public int TotalProducts { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
}
