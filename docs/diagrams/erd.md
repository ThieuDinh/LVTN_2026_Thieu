# ERD — Sàn TMĐT Nông sản đa gian hàng

## Sơ đồ quan hệ thực thể (Mermaid)

```mermaid
erDiagram

    %% ============================
    %% BASE ENTITY (kế thừa chung)
    %% ============================

    %% ============================
    %% USER & ADDRESS
    %% ============================
    User {
        int Id PK
        string FullName
        string Email UK
        string PasswordHash
        string Phone
        string Avatar
        UserRole Role
        bool IsActive
        datetime CreatedAt
        datetime UpdatedAt
        datetime DeletedAt
    }

    Address {
        int Id PK
        int UserId FK
        string ReceiverName
        string Phone
        string Province
        string District
        string Ward
        string Detail
        bool IsDefault
    }

    User ||--o{ Address : "có nhiều"
    User ||--o| Shop : "sở hữu"
    User ||--o| Cart : "có"
    User ||--o{ Order : "đặt"
    User ||--o{ Review : "viết"
    User ||--o{ Notification : "nhận"

    %% ============================
    %% SHOP
    %% ============================
    Shop {
        int Id PK
        int OwnerId FK
        string Name
        string Slug UK
        string Logo
        string Description
        string Province
        ShopStatus Status
        decimal CommissionRate
        float Rating
    }

    Shop ||--o{ Product : "bán"
    Shop ||--o{ ImportOrder : "nhập hàng"
    Shop ||--o{ ShopOrder : "nhận đơn"
    Shop ||--o{ PlatformRevenue : "đóng hoa hồng"

    %% ============================
    %% CATEGORY (tự tham chiếu)
    %% ============================
    Category {
        int Id PK
        int ParentId FK
        string Name
        string Slug UK
        string Icon
        int SortOrder
    }

    Category ||--o{ Category : "cha-con"
    Category ||--o{ Product : "chứa"

    %% ============================
    %% PRODUCT & liên quan
    %% ============================
    Product {
        int Id PK
        int ShopId FK
        int CategoryId FK
        string Name
        string Slug UK
        string Description
        string Unit
        decimal BasePrice
        ProductStatus Status
        int TotalSold
    }

    Product ||--o{ ProductVariant : "có nhiều biến thể"
    Product ||--o{ ProductAttribute : "có nhiều thuộc tính"
    Product ||--o{ Review : "được đánh giá"

    ProductVariant {
        int Id PK
        int ProductId FK
        string Name
        decimal Price
        int Stock
        string SKU UK
        string Images
    }

    ProductAttribute {
        int Id PK
        int ProductId FK
        string AttrName
        string AttrValue
    }

    ProductVariant ||--o{ CartItem : "trong giỏ"
    ProductVariant ||--o{ ImportOrderItem : "nhập kho"
    ProductVariant ||--o{ OrderItem : "được đặt"

    %% ============================
    %% CART
    %% ============================
    Cart {
        int Id PK
        int UserId FK
    }

    Cart ||--o{ CartItem : "chứa"

    CartItem {
        int Id PK
        int CartId FK
        int VariantId FK
        int Quantity
    }

    %% ============================
    %% IMPORT (Nhập hàng & Kho)
    %% ============================
    ImportOrder {
        int Id PK
        int ShopId FK
        string ImportCode UK
        string HarvestSeason
        string SupplierName
        decimal TotalCost
        string Note
        string DocumentImages
        ImportOrderStatus Status
        datetime ImportedAt
    }

    ImportOrder ||--o{ ImportOrderItem : "gồm"

    ImportOrderItem {
        int Id PK
        int ImportOrderId FK
        int VariantId FK
        string BatchCode UK
        int Quantity
        int RemainingQty
        decimal CostPrice
        datetime ManufacturedAt
        datetime ExpiredAt
        ImportOrderItemStatus Status
    }

    ImportOrderItem ||--o{ OrderItemBatch : "trừ kho theo lô"

    %% ============================
    %% ORDER (Đơn hàng)
    %% ============================
    Order {
        int Id PK
        int BuyerId FK
        string PaymentMethod
        PaymentStatus PaymentStatus
        decimal GrandTotal
        string Note
    }

    Order ||--o{ ShopOrder : "tách theo shop"
    Order ||--o| Payment : "thanh toán"

    ShopOrder {
        int Id PK
        int OrderId FK
        int ShopId FK
        string ShipReceiverName
        string ShipPhone
        string ShipProvince
        string ShipDistrict
        string ShipWard
        string ShipDetail
        decimal SubTotal
        decimal ShippingFee
        decimal Total
        ShopOrderStatus Status
        string TrackingCode
    }

    ShopOrder ||--o{ OrderItem : "gồm"
    ShopOrder ||--o| PlatformRevenue : "tính hoa hồng"

    OrderItem {
        int Id PK
        int ShopOrderId FK
        int VariantId FK
        string SnapshotName
        string SnapshotSKU
        decimal SnapshotPrice
        string SnapshotImage
        int Quantity
        decimal LineTotal
    }

    OrderItem ||--o{ OrderItemBatch : "trừ từ nhiều lô"
    OrderItem ||--o| Review : "được đánh giá"

    OrderItemBatch {
        int Id PK
        int OrderItemId FK
        int ImportOrderItemId FK
        int QuantityUsed
        string ExpirySnapshot
    }

    %% ============================
    %% PAYMENT
    %% ============================
    Payment {
        int Id PK
        int OrderId FK
        string Method
        PaymentStatus Status
        decimal Amount
        string TransactionId
        string GatewayResponse
        datetime PaidAt
    }

    %% ============================
    %% PLATFORM REVENUE
    %% ============================
    PlatformRevenue {
        int Id PK
        int ShopOrderId FK
        int ShopId FK
        decimal OrderTotal
        decimal CommissionRate
        decimal CommissionAmount
        RevenueStatus Status
    }

    %% ============================
    %% REVIEW
    %% ============================
    Review {
        int Id PK
        int BuyerId FK
        int ProductId FK
        int OrderItemId FK
        int Rating
        string Comment
        string Images
    }

    %% ============================
    %% NOTIFICATION
    %% ============================
    Notification {
        int Id PK
        int UserId FK
        string Type
        string Title
        string Body
        bool IsRead
    }
```

---

## Bảng tổng hợp quan hệ

| Quan hệ | Bảng A | Bảng B | Loại | FK nằm ở |
|----------|--------|--------|------|----------|
| User → Address | User | Address | 1 - N | Address.UserId |
| User → Shop | User | Shop | 1 - 0..1 | Shop.OwnerId |
| User → Cart | User | Cart | 1 - 0..1 | Cart.UserId |
| User → Order | User | Order | 1 - N | Order.BuyerId |
| User → Review | User | Review | 1 - N | Review.BuyerId |
| User → Notification | User | Notification | 1 - N | Notification.UserId |
| Category → Category | Category | Category | 1 - N (tự tham chiếu) | Category.ParentId |
| Category → Product | Category | Product | 1 - N | Product.CategoryId |
| Shop → Product | Shop | Product | 1 - N | Product.ShopId |
| Shop → ImportOrder | Shop | ImportOrder | 1 - N | ImportOrder.ShopId |
| Shop → ShopOrder | Shop | ShopOrder | 1 - N | ShopOrder.ShopId |
| Shop → PlatformRevenue | Shop | PlatformRevenue | 1 - N | PlatformRevenue.ShopId |
| Product → ProductVariant | Product | ProductVariant | 1 - N | ProductVariant.ProductId |
| Product → ProductAttribute | Product | ProductAttribute | 1 - N | ProductAttribute.ProductId |
| Product → Review | Product | Review | 1 - N | Review.ProductId |
| ProductVariant → CartItem | ProductVariant | CartItem | 1 - N | CartItem.VariantId |
| ProductVariant → ImportOrderItem | ProductVariant | ImportOrderItem | 1 - N | ImportOrderItem.VariantId |
| ProductVariant → OrderItem | ProductVariant | OrderItem | 1 - N | OrderItem.VariantId |
| Cart → CartItem | Cart | CartItem | 1 - N | CartItem.CartId |
| ImportOrder → ImportOrderItem | ImportOrder | ImportOrderItem | 1 - N | ImportOrderItem.ImportOrderId |
| ImportOrderItem → OrderItemBatch | ImportOrderItem | OrderItemBatch | 1 - N | OrderItemBatch.ImportOrderItemId |
| Order → ShopOrder | Order | ShopOrder | 1 - N | ShopOrder.OrderId |
| Order → Payment | Order | Payment | 1 - 0..1 | Payment.OrderId |
| ShopOrder → OrderItem | ShopOrder | OrderItem | 1 - N | OrderItem.ShopOrderId |
| ShopOrder → PlatformRevenue | ShopOrder | PlatformRevenue | 1 - 0..1 | PlatformRevenue.ShopOrderId |
| OrderItem → OrderItemBatch | OrderItem | OrderItemBatch | 1 - N | OrderItemBatch.OrderItemId |
| OrderItem → Review | OrderItem | Review | 1 - 0..1 | Review.OrderItemId |

**Tổng cộng: 18 Entity, 27 quan hệ**
