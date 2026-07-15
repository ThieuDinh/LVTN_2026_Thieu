using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ShopSubscriptionConfiguration : IEntityTypeConfiguration<ShopSubscription>
{
    public void Configure(EntityTypeBuilder<ShopSubscription> builder)
    {
        builder.ToTable("ShopSubscriptions");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.StartDate).IsRequired();
        builder.Property(s => s.EndDate).IsRequired();
        builder.Property(s => s.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

        builder.HasOne(s => s.Shop)
            .WithMany(shop => shop.ShopSubscriptions)
            .HasForeignKey(s => s.ShopId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.Plan)
            .WithMany(p => p.ShopSubscriptions)
            .HasForeignKey(s => s.PlanId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(s => s.DeletedAt == null);
    }
}
