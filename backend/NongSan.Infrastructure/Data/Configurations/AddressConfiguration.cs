using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NongSan.Domain.Entities;

namespace NongSan.Infrastructure.Data.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("Addresses");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.ReceiverName).IsRequired().HasMaxLength(150);
        builder.Property(a => a.Phone).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Province).IsRequired().HasMaxLength(100);
        builder.Property(a => a.District).IsRequired().HasMaxLength(100);
        builder.Property(a => a.Ward).IsRequired().HasMaxLength(100);
        builder.Property(a => a.Detail).IsRequired().HasMaxLength(500);

        builder.HasOne(a => a.User)
            .WithMany(u => u.Addresses)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(a => a.DeletedAt == null);
    }
}
