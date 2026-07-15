erDiagram
    Users {
        int Id PK
        nvarchar FullName
        nvarchar Email
        nvarchar PasswordHash
        nvarchar Phone
        nvarchar Avatar
        nvarchar Role
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Addresses {
        int Id PK
        int UserId FK
        nvarchar ReceiverName
        nvarchar Phone
        nvarchar Province
        nvarchar District
        nvarchar Ward
        nvarchar Detail
        bit IsDefault
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Carts {
        int Id PK
        int UserId FK
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    CartItems {
        int Id PK
        int CartId FK
        int VariantId FK
        int Quantity
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Categories {
        int Id PK
        int ParentId FK
        nvarchar Name
        nvarchar Slug
        nvarchar Icon
        int SortOrder
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Products {
        int Id PK
        int ShopId FK
        int CategoryId FK
        nvarchar Name
        nvarchar Slug
        nvarchar Description
        nvarchar Unit
        decimal BasePrice
        nvarchar Status
        int TotalSold
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    ProductAttributes {
        int Id PK
        int ProductId FK
        nvarchar AttrName
        nvarchar AttrValue
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    ProductVariants {
        int Id PK
        int ProductId FK
        nvarchar Name
        decimal Price
        int Stock
        nvarchar SKU
        nvarchar Images
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Shops {
        int Id PK
        int OwnerId FK
        nvarchar Name
        nvarchar Slug
        nvarchar Logo
        nvarchar Description
        nvarchar Province
        nvarchar Status
        decimal CommissionRate
        real Rating
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    SubscriptionPlans {
        int Id PK
        nvarchar Name
        decimal MonthlyPrice
        decimal CommissionRate
        int MaxProducts
        int BoostScore
        bit IsActive
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    ShopSubscriptions {
        int Id PK
        int ShopId FK
        int PlanId FK
        datetime2 StartDate
        datetime2 EndDate
        nvarchar Status
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Orders {
        int Id PK
        int BuyerId FK
        nvarchar PaymentMethod
        nvarchar PaymentStatus
        decimal GrandTotal
        nvarchar Note
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    ShopOrders {
        int Id PK
        int OrderId FK
        int ShopId FK
        nvarchar ShipReceiverName
        nvarchar ShipPhone
        nvarchar ShipProvince
        nvarchar ShipDistrict
        nvarchar ShipWard
        nvarchar ShipDetail
        decimal SubTotal
        decimal ShippingFee
        decimal Total
        nvarchar Status
        nvarchar TrackingCode
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
        nvarchar CancelledBy
        nvarchar CancelledReason
    }

    OrderItems {
        int Id PK
        int ShopOrderId FK
        int VariantId FK
        nvarchar SnapshotName
        nvarchar SnapshotSKU
        decimal SnapshotPrice
        nvarchar SnapshotImage
        int Quantity
        decimal LineTotal
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Payments {
        int Id PK
        int OrderId FK
        nvarchar Method
        nvarchar Status
        decimal Amount
        nvarchar TransactionId
        nvarchar GatewayResponse
        datetime2 PaidAt
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    PlatformRevenues {
        int Id PK
        int ShopOrderId FK
        int ShopId FK
        decimal OrderTotal
        decimal CommissionRate
        decimal CommissionAmount
        nvarchar Status
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Reviews {
        int Id PK
        int BuyerId FK
        int ProductId FK
        int OrderItemId FK
        int Rating
        nvarchar Comment
        nvarchar Images
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    ImportOrders {
        int Id PK
        int ShopId FK
        nvarchar ImportCode
        nvarchar HarvestSeason
        nvarchar SupplierName
        decimal TotalCost
        nvarchar Note
        nvarchar DocumentImages
        nvarchar Status
        datetime2 ImportedAt
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    ImportOrderItems {
        int Id PK
        int ImportOrderId FK
        int VariantId FK
        nvarchar BatchCode
        int Quantity
        int RemainingQty
        decimal CostPrice
        datetime2 ManufacturedAt
        datetime2 ExpiredAt
        nvarchar Status
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    OrderItemBatches {
        int Id PK
        int OrderItemId FK
        int ImportOrderItemId FK
        int QuantityUsed
        nvarchar ExpirySnapshot
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    Notifications {
        int Id PK
        int UserId FK
        nvarchar Type
        nvarchar Title
        nvarchar Body
        bit IsRead
        datetime2 CreatedAt
        datetime2 UpdatedAt
        datetime2 DeletedAt
    }

    %% Relationships Definition
    Users ||--o{ Addresses : "has"
    Users ||--o{ Carts : "has"
    Users ||--o{ Shops : "owns"
    Users ||--o{ Orders : "places"
    Users ||--o{ Reviews : "writes"
    Users ||--o{ Notifications : "receives"

    Carts ||--o{ CartItems : "contains"
    ProductVariants ||--o{ CartItems : "added to"

    Categories ||--o{ Categories : "parent of"
    Categories ||--o{ Products : "categorizes"
    Shops ||--o{ Products : "sells"

    Products ||--o{ ProductAttributes : "has"
    Products ||--o{ ProductVariants : "has"
    Products ||--o{ Reviews : "receives"

    Orders ||--o{ Payments : "paid via"
    Orders ||--o{ ShopOrders : "split into"

    Shops ||--o{ ShopOrders : "fulfills"
    ShopOrders ||--o{ OrderItems : "contains"

    ProductVariants ||--o{ OrderItems : "ordered as"
    OrderItems ||--o{ Reviews : "reviewed in"

    Shops ||--o{ ImportOrders : "imports"
    ImportOrders ||--o{ ImportOrderItems : "contains"
    ProductVariants ||--o{ ImportOrderItems : "imported as"

    OrderItems ||--o{ OrderItemBatches : "fulfilled by"
    ImportOrderItems ||--o{ OrderItemBatches : "supplies"

    SubscriptionPlans ||--o{ ShopSubscriptions : "subscribed to"
    Shops ||--o{ ShopSubscriptions : "has"

    ShopOrders ||--o{ PlatformRevenues : "calculated from"
    Shops ||--o{ PlatformRevenues : "generates"