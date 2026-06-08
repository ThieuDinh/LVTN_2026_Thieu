using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class PlatformRevenueConfiguration : IEntityTypeConfiguration<PlatformRevenue>
{
    public void Configure(EntityTypeBuilder<PlatformRevenue> builder)
    {
        builder.ToTable("PlatformRevenues");

        builder.HasKey(pr => pr.Id);

        builder.Property(pr => pr.OrderTotal).HasPrecision(18, 2);
        builder.Property(pr => pr.CommissionRate).HasPrecision(5, 4);
        builder.Property(pr => pr.CommissionAmount).HasPrecision(18, 2);
        builder.Property(pr => pr.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(pr => pr.ShopOrderId).IsUnique();

        builder.HasOne(pr => pr.ShopOrder)
            .WithOne(so => so.PlatformRevenue)
            .HasForeignKey<PlatformRevenue>(pr => pr.ShopOrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pr => pr.Shop)
            .WithMany(s => s.PlatformRevenues)
            .HasForeignKey(pr => pr.ShopId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(pr => pr.DeletedAt == null);
    }
}
