using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Subscription;
using NongSan.Application.Interfaces;
using NongSan.Domain.Entities;
using NongSan.Domain.Enums;

namespace NongSan.Application.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly IAppDbContext _context;

    public SubscriptionService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<SubscriptionPlanDto>>> GetAllPlansAsync()
    {
        var plans = await _context.SubscriptionPlans
            .Where(p => p.IsActive)
            .OrderBy(p => p.MonthlyPrice)
            .Select(p => new SubscriptionPlanDto
            {
                Id = p.Id,
                Name = p.Name,
                MonthlyPrice = p.MonthlyPrice,
                CommissionRate = p.CommissionRate,
                MaxProducts = p.MaxProducts,
                BoostScore = p.BoostScore
            })
            .ToListAsync();

        return Result<List<SubscriptionPlanDto>>.Ok(plans);
    }

    public async Task<Result<ShopSubscriptionDto>> GetCurrentSubscriptionAsync(int shopId)
    {
        var now = DateTime.UtcNow;

        var subscription = await _context.ShopSubscriptions
            .Include(s => s.Plan)
            .Where(s => s.ShopId == shopId
                && s.Status == ShopSubscriptionStatus.Active
                && s.EndDate > now)
            .OrderByDescending(s => s.EndDate)
            .FirstOrDefaultAsync();

        if (subscription == null)
            return Result<ShopSubscriptionDto>.Fail("Shop chưa có gói đăng ký nào đang hoạt động.");

        return Result<ShopSubscriptionDto>.Ok(MapToDto(subscription));
    }

    public async Task<Result<ShopSubscriptionDto>> RegisterAsync(RegisterShopSubscriptionRequest request)
    {
        // Kiểm tra shop tồn tại
        var shop = await _context.Shops.FindAsync(request.ShopId);
        if (shop == null)
            return Result<ShopSubscriptionDto>.Fail("Shop không tồn tại.");

        // Kiểm tra plan tồn tại và đang active
        var plan = await _context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Id == request.PlanId && p.IsActive);
        if (plan == null)
            return Result<ShopSubscriptionDto>.Fail("Gói đăng ký không tồn tại hoặc không khả dụng.");

        // Kiểm tra shop đã có subscription Active chưa
        var now = DateTime.UtcNow;
        var hasActive = await _context.ShopSubscriptions
            .AnyAsync(s => s.ShopId == request.ShopId
                && s.Status == ShopSubscriptionStatus.Active
                && s.EndDate > now);

        if (hasActive)
            return Result<ShopSubscriptionDto>.Fail("Shop đã có gói đang hoạt động.");

        var subscription = new ShopSubscription
        {
            ShopId = request.ShopId,
            PlanId = request.PlanId,
            StartDate = now,
            EndDate = now.AddMonths(request.DurationMonths),
            Status = ShopSubscriptionStatus.Active
        };

        _context.ShopSubscriptions.Add(subscription);
        await _context.SaveChangesAsync();

        // Load plan navigation cho response
        subscription.Plan = plan;

        return Result<ShopSubscriptionDto>.Ok(MapToDto(subscription));
    }

    private static ShopSubscriptionDto MapToDto(ShopSubscription subscription) => new()
    {
        Id = subscription.Id,
        ShopId = subscription.ShopId,
        PlanId = subscription.PlanId,
        PlanName = subscription.Plan.Name,
        StartDate = subscription.StartDate,
        EndDate = subscription.EndDate,
        Status = subscription.Status.ToString()
    };
}
