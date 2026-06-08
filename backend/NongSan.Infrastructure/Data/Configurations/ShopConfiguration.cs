using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ShopConfiguration : IEntityTypeConfiguration<Shop>
{
    public void Configure(EntityTypeBuilder<Shop> builder)
    {
        builder.ToTable("Shops");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Slug).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Logo).HasMaxLength(500);
        builder.Property(s => s.Description).HasMaxLength(2000);
        builder.Property(s => s.Province).HasMaxLength(100);
        builder.Property(s => s.Status).IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(s => s.CommissionRate).HasPrecision(5, 4);

        builder.HasIndex(s => s.Slug).IsUnique();

        builder.HasOne(s => s.Owner)
            .WithOne(u => u.Shop)
            .HasForeignKey<Shop>(s => s.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(s => s.DeletedAt == null);
    }
}
