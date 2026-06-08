using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttribute>
{
    public void Configure(EntityTypeBuilder<ProductAttribute> builder)
    {
        builder.ToTable("ProductAttributes");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.AttrName).IsRequired().HasMaxLength(100);
        builder.Property(a => a.AttrValue).IsRequired().HasMaxLength(500);

        builder.HasOne(a => a.Product)
            .WithMany(p => p.Attributes)
            .HasForeignKey(a => a.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(a => a.DeletedAt == null);
    }
}
