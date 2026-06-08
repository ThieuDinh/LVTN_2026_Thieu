using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class ImportOrderConfiguration : IEntityTypeConfiguration<ImportOrder>
{
    public void Configure(EntityTypeBuilder<ImportOrder> builder)
    {
        builder.ToTable("ImportOrders");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.ImportCode).IsRequired().HasMaxLength(50);
        builder.Property(i => i.HarvestSeason).HasMaxLength(100);
        builder.Property(i => i.SupplierName).HasMaxLength(200);
        builder.Property(i => i.TotalCost).HasPrecision(18, 2);
        builder.Property(i => i.Note).HasMaxLength(1000);
        builder.Property(i => i.DocumentImages).HasMaxLength(2000);
        builder.Property(i => i.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(i => i.ImportCode).IsUnique();

        builder.HasOne(i => i.Shop)
            .WithMany(s => s.ImportOrders)
            .HasForeignKey(i => i.ShopId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(i => i.DeletedAt == null);
    }
}
