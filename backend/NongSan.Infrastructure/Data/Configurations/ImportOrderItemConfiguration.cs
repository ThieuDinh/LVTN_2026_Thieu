using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ImportOrderItemConfiguration : IEntityTypeConfiguration<ImportOrderItem>
{
    public void Configure(EntityTypeBuilder<ImportOrderItem> builder)
    {
        builder.ToTable("ImportOrderItems");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.BatchCode).IsRequired().HasMaxLength(50);
        builder.Property(i => i.CostPrice).HasPrecision(18, 2);
        builder.Property(i => i.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(i => i.BatchCode);

        builder.HasOne(i => i.ImportOrder)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.ImportOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Variant)
            .WithMany(v => v.ImportOrderItems)
            .HasForeignKey(i => i.VariantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(i => i.DeletedAt == null);
    }
}
