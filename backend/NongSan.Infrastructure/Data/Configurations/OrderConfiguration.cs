using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.PaymentMethod).IsRequired().HasMaxLength(50);
        builder.Property(o => o.PaymentStatus).IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.GrandTotal).HasPrecision(18, 2);
        builder.Property(o => o.Note).HasMaxLength(1000);

        builder.HasOne(o => o.Buyer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(o => o.DeletedAt == null);
    }
}
