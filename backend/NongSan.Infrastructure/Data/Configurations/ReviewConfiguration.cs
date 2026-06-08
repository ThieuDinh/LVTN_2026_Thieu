using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Rating).IsRequired();
        builder.Property(r => r.Comment).HasMaxLength(2000);
        builder.Property(r => r.Images).HasMaxLength(2000);

        builder.HasIndex(r => r.OrderItemId).IsUnique();

        builder.HasOne(r => r.Buyer)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.OrderItem)
            .WithOne(oi => oi.Review)
            .HasForeignKey<Review>(r => r.OrderItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(r => r.DeletedAt == null);
    }
}
