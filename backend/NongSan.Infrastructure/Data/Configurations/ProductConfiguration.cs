using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired().HasMaxLength(300);
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(300);
        builder.Property(p => p.Description).HasMaxLength(5000);
        builder.Property(p => p.Unit).IsRequired().HasMaxLength(50);
        builder.Property(p => p.BasePrice).HasPrecision(18, 2);
        builder.Property(p => p.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(p => p.Slug).IsUnique();

        builder.HasOne(p => p.Shop)
            .WithMany(s => s.Products)
            .HasForeignKey(p => p.ShopId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(p => p.DeletedAt == null);
    }
}
