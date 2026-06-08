using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("ProductVariants");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.Name).IsRequired().HasMaxLength(200);
        builder.Property(v => v.Price).HasPrecision(18, 2);
        builder.Property(v => v.SKU).IsRequired().HasMaxLength(100);
        builder.Property(v => v.Images).HasMaxLength(2000);

        builder.HasIndex(v => v.SKU).IsUnique();

        builder.HasOne(v => v.Product)
            .WithMany(p => p.Variants)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(v => v.DeletedAt == null);
    }
}
