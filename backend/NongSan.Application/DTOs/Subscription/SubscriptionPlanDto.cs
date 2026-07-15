namespace NongSan.Application.DTOs.Subscription;

public class SubscriptionPlanDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public decimal CommissionRate { get; set; }
    public int MaxProducts { get; set; }
    public int BoostScore { get; set; }
}
