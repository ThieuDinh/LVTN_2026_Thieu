using Microsoft.EntityFrameworkCore;
using NongSan.Domain.Entities;

namespace NongSan.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Shop> Shops { get; }
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductVariant> ProductVariants { get; }
    DbSet<ProductAttribute> ProductAttributes { get; }
    DbSet<ImportOrder> ImportOrders { get; }
    DbSet<ImportOrderItem> ImportOrderItems { get; }
    DbSet<Cart> Carts { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<ShopOrder> ShopOrders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<OrderItemBatch> OrderItemBatches { get; }
    DbSet<Payment> Payments { get; }
    DbSet<PlatformRevenue> PlatformRevenues { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<SubscriptionPlan> SubscriptionPlans { get; }
    DbSet<ShopSubscription> ShopSubscriptions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
