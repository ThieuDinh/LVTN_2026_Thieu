using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class SubscriptionPlanConfiguration : IEntityTypeConfiguration<SubscriptionPlan>
{
    public void Configure(EntityTypeBuilder<SubscriptionPlan> builder)
    {
        builder.ToTable("SubscriptionPlans");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        builder.Property(p => p.MonthlyPrice).HasPrecision(18, 2);
        builder.Property(p => p.CommissionRate).HasPrecision(5, 4);
        builder.Property(p => p.MaxProducts).IsRequired();
        builder.Property(p => p.BoostScore).IsRequired();
        builder.Property(p => p.IsActive).IsRequired().HasDefaultValue(true);

        builder.HasQueryFilter(p => p.DeletedAt == null);
    }
}
