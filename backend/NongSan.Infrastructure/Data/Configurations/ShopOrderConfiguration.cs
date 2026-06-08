using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ShopOrderConfiguration : IEntityTypeConfiguration<ShopOrder>
{
    public void Configure(EntityTypeBuilder<ShopOrder> builder)
    {
        builder.ToTable("ShopOrders");

        builder.HasKey(so => so.Id);

        builder.Property(so => so.ShipReceiverName).IsRequired().HasMaxLength(150);
        builder.Property(so => so.ShipPhone).IsRequired().HasMaxLength(20);
        builder.Property(so => so.ShipProvince).IsRequired().HasMaxLength(100);
        builder.Property(so => so.ShipDistrict).IsRequired().HasMaxLength(100);
        builder.Property(so => so.ShipWard).IsRequired().HasMaxLength(100);
        builder.Property(so => so.ShipDetail).IsRequired().HasMaxLength(500);
        builder.Property(so => so.SubTotal).HasPrecision(18, 2);
        builder.Property(so => so.ShippingFee).HasPrecision(18, 2);
        builder.Property(so => so.Total).HasPrecision(18, 2);
        builder.Property(so => so.Status).IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(so => so.TrackingCode).HasMaxLength(100);

        builder.HasOne(so => so.Order)
            .WithMany(o => o.ShopOrders)
            .HasForeignKey(so => so.OrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(so => so.Shop)
            .WithMany(s => s.ShopOrders)
            .HasForeignKey(so => so.ShopId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(so => so.DeletedAt == null);
    }
}
