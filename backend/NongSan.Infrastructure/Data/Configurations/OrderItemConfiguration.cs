using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");

        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.SnapshotName).IsRequired().HasMaxLength(300);
        builder.Property(oi => oi.SnapshotSKU).IsRequired().HasMaxLength(100);
        builder.Property(oi => oi.SnapshotPrice).HasPrecision(18, 2);
        builder.Property(oi => oi.SnapshotImage).HasMaxLength(500);
        builder.Property(oi => oi.LineTotal).HasPrecision(18, 2);

        builder.HasOne(oi => oi.ShopOrder)
            .WithMany(so => so.OrderItems)
            .HasForeignKey(oi => oi.ShopOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Variant)
            .WithMany(v => v.OrderItems)
            .HasForeignKey(oi => oi.VariantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(oi => oi.DeletedAt == null);
    }
}
