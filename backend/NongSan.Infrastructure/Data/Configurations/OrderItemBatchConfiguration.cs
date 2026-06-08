using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class OrderItemBatchConfiguration : IEntityTypeConfiguration<OrderItemBatch>
{
    public void Configure(EntityTypeBuilder<OrderItemBatch> builder)
    {
        builder.ToTable("OrderItemBatches");

        builder.HasKey(ob => ob.Id);

        builder.Property(ob => ob.ExpirySnapshot).IsRequired().HasMaxLength(100);

        builder.HasOne(ob => ob.OrderItem)
            .WithMany(oi => oi.OrderItemBatches)
            .HasForeignKey(ob => ob.OrderItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ob => ob.ImportOrderItem)
            .WithMany(ii => ii.OrderItemBatches)
            .HasForeignKey(ob => ob.ImportOrderItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(ob => ob.DeletedAt == null);
    }
}
