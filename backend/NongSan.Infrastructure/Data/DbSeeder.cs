using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NongSan.Domain.Entities;
using NongSan.Domain.Enums;

namespace NongSan.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Tự động tạo/cập nhật database từ migrations
        await db.Database.MigrateAsync();

        var now = DateTime.UtcNow;

        // ===== SUBSCRIPTION PLANS (luôn seed nếu chưa có) =====
        await SeedSubscriptionPlansAsync(db, now);

        // Chỉ seed dữ liệu mẫu nếu chưa có products
        if (await db.Products.AnyAsync())
            return;

        // ===== 1. USERS (chỉ thêm nếu chưa tồn tại) =====
        // Password mặc định: "Password123!" — BCrypt hash
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("123456");

        var admin = await db.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Admin);
        if (admin == null)
        {
            admin = new User
            {
                FullName = "Admin NôngSan",
                Email = "admin@nongsan.vn",
                PasswordHash = passwordHash,
                Phone = "0900000001",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = now
            };
            db.Users.Add(admin);
        }

        var seller1 = await db.Users.FirstOrDefaultAsync(u => u.Email == "trung@nongsan.vn");
        if (seller1 == null)
        {
            seller1 = new User
            {
                FullName = "Nguyễn Văn Trung",
                Email = "trung@nongsan.vn",
                PasswordHash = passwordHash,
                Phone = "0900000002",
                Role = UserRole.Seller,
                IsActive = true,
                CreatedAt = now
            };
            db.Users.Add(seller1);
        }

        var seller2 = await db.Users.FirstOrDefaultAsync(u => u.Email == "huong@nongsan.vn");
        if (seller2 == null)
        {
            seller2 = new User
            {
                FullName = "Lê Thị Hương",
                Email = "huong@nongsan.vn",
                PasswordHash = passwordHash,
                Phone = "0900000003",
                Role = UserRole.Seller,
                IsActive = true,
                CreatedAt = now
            };
            db.Users.Add(seller2);
        }

        var seller3 = await db.Users.FirstOrDefaultAsync(u => u.Email == "minh@nongsan.vn");
        if (seller3 == null)
        {
            seller3 = new User
            {
                FullName = "Trần Văn Minh",
                Email = "minh@nongsan.vn",
                PasswordHash = passwordHash,
                Phone = "0900000004",
                Role = UserRole.Seller,
                IsActive = true,
                CreatedAt = now
            };
            db.Users.Add(seller3);
        }

        await db.SaveChangesAsync();

        // ===== 2. SHOPS =====
        // CommissionRate phản ánh gói đăng ký tương ứng
        var shop1 = new Shop
        {
            OwnerId = seller1.Id,
            Name = "Nông Trại Xanh Đà Lạt",
            Slug = "nong-trai-xanh-da-lat",
            Description = "Chuyên cung cấp nông sản sạch từ Đà Lạt, mứt trái cây, cà phê nguyên chất.",
            Province = "Lâm Đồng",
            Status = ShopStatus.Active,
            CommissionRate = 0.03m, // Gói Cao cấp
            Rating = 4.8f,
            CreatedAt = now
        };

        var shop2 = new Shop
        {
            OwnerId = seller2.Id,
            Name = "Đặc Sản Miền Tây",
            Slug = "dac-san-mien-tay",
            Description = "Đặc sản vùng miền Tây Nam Bộ — trái cây sấy, mật ong nguyên chất, combo quà tặng.",
            Province = "Bến Tre",
            Status = ShopStatus.Active,
            CommissionRate = 0.05m, // Gói Tiêu chuẩn
            Rating = 4.6f,
            CreatedAt = now
        };

        var shop3 = new Shop
        {
            OwnerId = seller3.Id,
            Name = "Vườn Nhà Mình",
            Slug = "vuon-nha-minh",
            Description = "Nông sản hữu cơ từ vườn nhà, rau củ quả tươi sạch mỗi ngày, không thuốc trừ sâu.",
            Province = "Đồng Nai",
            Status = ShopStatus.Active,
            CommissionRate = 0.08m, // Gói Cơ bản
            Rating = 4.3f,
            CreatedAt = now
        };

        db.Shops.AddRange(shop1, shop2, shop3);
        await db.SaveChangesAsync();

        // ===== 3. SHOP SUBSCRIPTIONS =====
        // Shop 1 → Cao cấp, Shop 2 → Tiêu chuẩn, Shop 3 → Cơ bản
        await SeedShopSubscriptionsAsync(db, shop1.Id, shop2.Id, shop3.Id, now);

        // ===== 4. CATEGORIES =====
        var catMut = new Category { Name = "Mứt & Ô mai", Slug = "mut-o-mai", Icon = "🍓", SortOrder = 1, CreatedAt = now };
        var catCaPhe = new Category { Name = "Cà phê", Slug = "ca-phe", Icon = "☕", SortOrder = 2, CreatedAt = now };
        var catTraiCaySay = new Category { Name = "Trái cây sấy", Slug = "trai-cay-say", Icon = "🍊", SortOrder = 3, CreatedAt = now };
        var catMatOng = new Category { Name = "Mật ong & Siro", Slug = "mat-ong-siro", Icon = "🍯", SortOrder = 4, CreatedAt = now };
        var catNguCoc = new Category { Name = "Ngũ cốc", Slug = "ngu-coc", Icon = "🌾", SortOrder = 5, CreatedAt = now };
        var catCombo = new Category { Name = "Combo quà tặng", Slug = "combo-qua-tang", Icon = "🎁", SortOrder = 6, CreatedAt = now };
        var catRauCu = new Category { Name = "Rau củ quả", Slug = "rau-cu-qua", Icon = "🥬", SortOrder = 7, CreatedAt = now };

        db.Categories.AddRange(catMut, catCaPhe, catTraiCaySay, catMatOng, catNguCoc, catCombo, catRauCu);
        await db.SaveChangesAsync();

        // ===== 5. PRODUCTS + VARIANTS =====
        var products = new List<Product>
        {
            // ─────────────────────────────────────────────────────
            // Shop 1: Nông Trại Xanh Đà Lạt — GÓI CAO CẤP ⭐
            // ─────────────────────────────────────────────────────
            new Product
            {
                ShopId = shop1.Id, CategoryId = catMut.Id,
                Name = "Mứt dâu tây Đà Lạt nguyên trái", Slug = "mut-dau-tay-da-lat",
                Description = "Mứt dâu tây được chế biến từ dâu tươi vườn Đà Lạt, vị chua ngọt tự nhiên, không chất bảo quản.",
                Unit = "hũ", BasePrice = 120000, Status = ProductStatus.Active, TotalSold = 342, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catMut.Id,
                Name = "Mứt xoài dẻo thái lát", Slug = "mut-xoai-deo-thai-lat",
                Description = "Xoài cát Hòa Lộc sấy dẻo, vị ngọt tự nhiên, giữ nguyên hương vị trái cây.",
                Unit = "gói", BasePrice = 85000, Status = ProductStatus.Active, TotalSold = 215, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catMut.Id,
                Name = "Ô mai mơ Hà Nội truyền thống", Slug = "o-mai-mo-ha-noi",
                Description = "Ô mai mơ chua ngọt theo công thức gia truyền, thơm ngon đậm đà.",
                Unit = "hộp", BasePrice = 95000, Status = ProductStatus.Active, TotalSold = 178, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catCaPhe.Id,
                Name = "Cà phê Arabica Cầu Đất rang mộc", Slug = "ca-phe-arabica-cau-dat",
                Description = "100% hạt Arabica Cầu Đất, rang mộc thủ công, hương thơm thanh nhẹ.",
                Unit = "gói", BasePrice = 199000, Status = ProductStatus.Active, TotalSold = 523, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catCaPhe.Id,
                Name = "Cà phê Robusta Buôn Ma Thuột", Slug = "ca-phe-robusta-bmt",
                Description = "Robusta nguyên chất từ Buôn Ma Thuột, vị đậm đà, hậu vị ngọt.",
                Unit = "gói", BasePrice = 165000, Status = ProductStatus.Active, TotalSold = 410, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catCaPhe.Id,
                Name = "Cà phê phin giấy tiện lợi (hộp 10 gói)", Slug = "ca-phe-phin-giay",
                Description = "Cà phê phin giấy drip bag, tiện lợi pha mọi nơi, hương Arabica đậm.",
                Unit = "hộp", BasePrice = 145000, Status = ProductStatus.Active, TotalSold = 289, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catNguCoc.Id,
                Name = "Ngũ cốc dinh dưỡng 7 loại hạt", Slug = "ngu-coc-7-loai-hat",
                Description = "Hỗn hợp 7 loại hạt: yến mạch, hạnh nhân, óc chó, hạt chia, hạt lanh, điều, macca.",
                Unit = "hộp", BasePrice = 185000, Status = ProductStatus.Active, TotalSold = 156, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catTraiCaySay.Id,
                Name = "Mít sấy giòn Đà Lạt", Slug = "mit-say-gion-da-lat",
                Description = "Mít sấy chân không giòn rụm, ngọt tự nhiên, không thêm đường.",
                Unit = "gói", BasePrice = 75000, Status = ProductStatus.Active, TotalSold = 467, CreatedAt = now
            },
            new Product
            {
                ShopId = shop1.Id, CategoryId = catTraiCaySay.Id,
                Name = "Hạt hướng dương sấy mộc Đà Lạt", Slug = "hat-huong-duong-da-lat",
                Description = "Hạt hướng dương to, mẩy, sấy mộc tự nhiên, không gia vị hóa học.",
                Unit = "gói", BasePrice = 55000, Status = ProductStatus.Active, TotalSold = 10, CreatedAt = now
            },

            // ─────────────────────────────────────────────────────
            // Shop 2: Đặc Sản Miền Tây — GÓI TIÊU CHUẨN ✨
            // ─────────────────────────────────────────────────────
            new Product
            {
                ShopId = shop2.Id, CategoryId = catTraiCaySay.Id,
                Name = "Xoài sấy dẻo Cao Lãnh", Slug = "xoai-say-deo-cao-lanh",
                Description = "Xoài cát Cao Lãnh sấy dẻo tự nhiên, giàu vitamin C, ăn vặt healthy.",
                Unit = "gói", BasePrice = 89000, Status = ProductStatus.Active, TotalSold = 387, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catTraiCaySay.Id,
                Name = "Khoai lang sấy giòn Bến Tre", Slug = "khoai-lang-say-gion",
                Description = "Khoai lang tím sấy giòn, không dầu mỡ, thích hợp cho người ăn kiêng.",
                Unit = "gói", BasePrice = 65000, Status = ProductStatus.Active, TotalSold = 201, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catMatOng.Id,
                Name = "Mật ong hoa cà phê Tây Nguyên", Slug = "mat-ong-hoa-ca-phe",
                Description = "Mật ong nguyên chất từ vùng hoa cà phê Tây Nguyên, hương vị đặc trưng.",
                Unit = "chai", BasePrice = 250000, Status = ProductStatus.Active, TotalSold = 145, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catMatOng.Id,
                Name = "Mật ong rừng U Minh nguyên chất", Slug = "mat-ong-rung-u-minh",
                Description = "Mật ong rừng U Minh Hạ, khai thác tự nhiên, đậm đặc, giàu dưỡng chất.",
                Unit = "chai", BasePrice = 350000, Status = ProductStatus.Active, TotalSold = 89, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catMut.Id,
                Name = "Mứt dừa Bến Tre vị lá dứa", Slug = "mut-dua-ben-tre-la-dua",
                Description = "Mứt dừa non Bến Tre vị lá dứa thơm, dẻo ngọt, đặc sản Tết.",
                Unit = "hộp", BasePrice = 110000, Status = ProductStatus.Active, TotalSold = 534, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catMut.Id,
                Name = "Mứt gừng dẻo Huế", Slug = "mut-gung-deo-hue",
                Description = "Mứt gừng Huế cay nồng, ngọt thanh, ấm bụng ngày đông.",
                Unit = "hộp", BasePrice = 78000, Status = ProductStatus.Active, TotalSold = 267, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catCombo.Id,
                Name = "Combo quà Tết Nông Sản Việt", Slug = "combo-qua-tet-nong-san",
                Description = "Hộp quà gồm: mứt dừa, cà phê Arabica, mật ong, trái cây sấy — bao bì sang trọng.",
                Unit = "hộp", BasePrice = 450000, Status = ProductStatus.Active, TotalSold = 67, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catNguCoc.Id,
                Name = "Granola trái cây sấy mix hạt", Slug = "granola-trai-cay-say",
                Description = "Granola handmade kết hợp yến mạch, hạt điều, hạnh nhân và trái cây sấy.",
                Unit = "hộp", BasePrice = 175000, Status = ProductStatus.Active, TotalSold = 134, CreatedAt = now
            },
            new Product
            {
                ShopId = shop2.Id, CategoryId = catTraiCaySay.Id,
                Name = "Hạt hướng dương tẩm vị dừa", Slug = "hat-huong-duong-vi-dua",
                Description = "Hạt hướng dương tẩm vị dừa Bến Tre béo ngậy, giòn tan.",
                Unit = "gói", BasePrice = 60000, Status = ProductStatus.Active, TotalSold = 60, CreatedAt = now
            },

            // ─────────────────────────────────────────────────────
            // Shop 3: Vườn Nhà Mình — GÓI CƠ BẢN (không badge)
            // ─────────────────────────────────────────────────────
            new Product
            {
                ShopId = shop3.Id, CategoryId = catRauCu.Id,
                Name = "Rau muống hữu cơ Đồng Nai", Slug = "rau-muong-huu-co",
                Description = "Rau muống tươi trồng hữu cơ, không thuốc trừ sâu, thu hoạch trong ngày.",
                Unit = "bó", BasePrice = 15000, Status = ProductStatus.Active, TotalSold = 89, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catRauCu.Id,
                Name = "Cà chua bi cherry đỏ", Slug = "ca-chua-bi-cherry",
                Description = "Cà chua bi cherry tươi ngon, ngọt thanh, trồng tự nhiên không phun thuốc.",
                Unit = "hộp", BasePrice = 35000, Status = ProductStatus.Active, TotalSold = 156, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catRauCu.Id,
                Name = "Dưa leo baby giòn ngọt", Slug = "dua-leo-baby",
                Description = "Dưa leo baby thu hoạch sáng sớm, giòn ngọt, thích hợp ăn sống hoặc salad.",
                Unit = "kg", BasePrice = 25000, Status = ProductStatus.Active, TotalSold = 78, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catRauCu.Id,
                Name = "Bí đỏ hạt dẻ Nhật Bản", Slug = "bi-do-hat-de",
                Description = "Bí đỏ giống Nhật Bản, thịt bở dẻo, vị ngọt bùi, giàu dinh dưỡng.",
                Unit = "quả", BasePrice = 45000, Status = ProductStatus.Active, TotalSold = 42, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catRauCu.Id,
                Name = "Khoai lang mật Đồng Nai", Slug = "khoai-lang-mat-dong-nai",
                Description = "Khoai lang mật trồng trên đất đỏ bazan, nướng ra mật vàng óng, ngọt lịm.",
                Unit = "kg", BasePrice = 30000, Status = ProductStatus.Active, TotalSold = 198, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catTraiCaySay.Id,
                Name = "Chuối sấy dẻo vườn nhà", Slug = "chuoi-say-deo-vuon-nha",
                Description = "Chuối xiêm sấy dẻo thủ công, vị ngọt thanh tự nhiên, không phẩm màu.",
                Unit = "gói", BasePrice = 40000, Status = ProductStatus.Active, TotalSold = 65, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catMatOng.Id,
                Name = "Mật ong hoa nhãn Đồng Nai", Slug = "mat-ong-hoa-nhan",
                Description = "Mật ong hoa nhãn nguyên chất, thơm nhẹ, khai thác từ vườn nhãn gia đình.",
                Unit = "chai", BasePrice = 180000, Status = ProductStatus.Active, TotalSold = 34, CreatedAt = now
            },
            new Product
            {
                ShopId = shop3.Id, CategoryId = catTraiCaySay.Id,
                Name = "Hạt hướng dương rang củi truyền thống", Slug = "hat-huong-duong-rang-cui",
                Description = "Hạt hướng dương rang củi thủ công, thơm mùi khói nhẹ, hạt đều.",
                Unit = "gói", BasePrice = 45000, Status = ProductStatus.Active, TotalSold = 100, CreatedAt = now
            },
        };

        db.Products.AddRange(products);
        await db.SaveChangesAsync();

        // ===== 6. PRODUCT VARIANTS =====
        var variants = new List<ProductVariant>();
        var skuIndex = 1;

        foreach (var p in products)
        {
            // Mỗi sản phẩm có 2–3 variants theo trọng lượng/kích thước
            variants.Add(new ProductVariant
            {
                ProductId = p.Id,
                Name = "Nhỏ",
                Price = p.BasePrice,
                Stock = 100,
                SKU = $"SKU-{skuIndex++:D4}",
                CreatedAt = now
            });

            variants.Add(new ProductVariant
            {
                ProductId = p.Id,
                Name = "Vừa",
                Price = Math.Round(p.BasePrice * 1.5m, 0),
                Stock = 80,
                SKU = $"SKU-{skuIndex++:D4}",
                CreatedAt = now
            });

            variants.Add(new ProductVariant
            {
                ProductId = p.Id,
                Name = "Lớn",
                Price = p.BasePrice * 2,
                Stock = 50,
                SKU = $"SKU-{skuIndex++:D4}",
                CreatedAt = now
            });
        }

        db.ProductVariants.AddRange(variants);
        await db.SaveChangesAsync();

        // ===== 7. PRODUCT ATTRIBUTES =====
        var attributes = new List<ProductAttribute>();

        foreach (var p in products)
        {
            var origin = p.ShopId == shop1.Id ? "Đà Lạt, Lâm Đồng"
                       : p.ShopId == shop2.Id ? "Bến Tre"
                       : "Đồng Nai";

            attributes.Add(new ProductAttribute
            {
                ProductId = p.Id,
                AttrName = "Xuất xứ",
                AttrValue = origin,
                CreatedAt = now
            });

            attributes.Add(new ProductAttribute
            {
                ProductId = p.Id,
                AttrName = "Hạn sử dụng",
                AttrValue = "12 tháng",
                CreatedAt = now
            });

            attributes.Add(new ProductAttribute
            {
                ProductId = p.Id,
                AttrName = "Bảo quản",
                AttrValue = "Nơi khô ráo, thoáng mát",
                CreatedAt = now
            });
        }

        db.ProductAttributes.AddRange(attributes);
        await db.SaveChangesAsync();

        // ===== 8. REVIEWS =====
        var reviews = new List<Review>();
        var random = new Random(42);
        var comments = new[]
        {
            "Sản phẩm rất ngon, đóng gói cẩn thận, sẽ mua lại!",
            "Chất lượng tốt, giao hàng nhanh. Cảm ơn shop!",
            "Vị rất tự nhiên, gia đình mình ai cũng thích.",
            "Đóng gói đẹp, thích hợp làm quà tặng.",
            "Giá hợp lý, sản phẩm đúng mô tả.",
            "Mình đã mua lần thứ 3, vẫn rất hài lòng.",
            "Hương vị đậm đà, rất đáng thử!",
            "Sản phẩm sạch, an tâm sử dụng cho cả nhà.",
        };

        // Tạo review cho mỗi sản phẩm (không cần OrderItem thật cho seed)
        // Lưu ý: OrderItemId sẽ bỏ qua vì chưa có order thật
        // Nếu có constraint NOT NULL, bạn cần tạo order trước

        Console.WriteLine("=== SEED DATA THÀNH CÔNG ===");
        Console.WriteLine($"  Users:              {await db.Users.CountAsync()}");
        Console.WriteLine($"  Shops:              {await db.Shops.CountAsync()}");
        Console.WriteLine($"  Categories:         {await db.Categories.CountAsync()}");
        Console.WriteLine($"  Products:           {await db.Products.CountAsync()}");
        Console.WriteLine($"  Product Variants:   {await db.ProductVariants.CountAsync()}");
        Console.WriteLine($"  Product Attrs:      {await db.ProductAttributes.CountAsync()}");
        Console.WriteLine($"  Subscription Plans: {await db.SubscriptionPlans.CountAsync()}");
        Console.WriteLine($"  Shop Subscriptions: {await db.ShopSubscriptions.CountAsync()}");
        Console.WriteLine("=============================");
        Console.WriteLine("  Tất cả tài khoản dùng password: 123456");
        Console.WriteLine("  Admin:  admin@nongsan.vn");
        Console.WriteLine("  Seller: trung@nongsan.vn (Cao cấp) / huong@nongsan.vn (Tiêu chuẩn) / minh@nongsan.vn (Cơ bản)");
        Console.WriteLine("  Buyer:  khoi@gmail.com / lan@gmail.com");
        Console.WriteLine("=============================");
    }

    /// <summary>
    /// Seed 3 gói đăng ký: Cơ bản, Tiêu chuẩn, Cao cấp.
    /// Chạy độc lập — luôn kiểm tra và thêm nếu chưa có.
    /// </summary>
    private static async Task SeedSubscriptionPlansAsync(AppDbContext db, DateTime now)
    {
        if (await db.SubscriptionPlans.AnyAsync())
            return;

        var plans = new List<SubscriptionPlan>
        {
            new SubscriptionPlan
            {
                Name = "Cơ bản",
                MonthlyPrice = 0,
                CommissionRate = 0.08m,
                MaxProducts = 20,
                BoostScore = 0,
                IsActive = true,
                CreatedAt = now
            },
            new SubscriptionPlan
            {
                Name = "Tiêu chuẩn",
                MonthlyPrice = 199000,
                CommissionRate = 0.05m,
                MaxProducts = 100,
                BoostScore = 50,
                IsActive = true,
                CreatedAt = now
            },
            new SubscriptionPlan
            {
                Name = "Cao cấp",
                MonthlyPrice = 499000,
                CommissionRate = 0.03m,
                MaxProducts = -1,
                BoostScore = 150,
                IsActive = true,
                CreatedAt = now
            }
        };

        db.SubscriptionPlans.AddRange(plans);
        await db.SaveChangesAsync();

        Console.WriteLine("  [Seed] Đã tạo 3 gói đăng ký: Cơ bản / Tiêu chuẩn / Cao cấp");
    }

    /// <summary>
    /// Gán gói cho 3 shop:
    ///   - Shop 1 (Đà Lạt) → Cao cấp (6 tháng)   — BoostScore 150 → badge ⭐
    ///   - Shop 2 (Miền Tây) → Tiêu chuẩn (3 tháng) — BoostScore 50 → badge ✨
    ///   - Shop 3 (Đồng Nai) → Cơ bản (1 tháng)   — BoostScore 0  → không badge
    /// </summary>
    private static async Task SeedShopSubscriptionsAsync(
        AppDbContext db, int shop1Id, int shop2Id, int shop3Id, DateTime now)
    {
        if (await db.ShopSubscriptions.AnyAsync())
            return;

        var caoCap = await db.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Name == "Cao cấp");
        var tieuChuan = await db.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Name == "Tiêu chuẩn");
        var coBan = await db.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Name == "Cơ bản");

        if (caoCap == null || tieuChuan == null || coBan == null)
            return;

        var subscriptions = new List<ShopSubscription>
        {
            new ShopSubscription
            {
                ShopId = shop1Id,
                PlanId = caoCap.Id,
                StartDate = now,
                EndDate = now.AddMonths(6),
                Status = ShopSubscriptionStatus.Active,
                CreatedAt = now
            },
            new ShopSubscription
            {
                ShopId = shop2Id,
                PlanId = tieuChuan.Id,
                StartDate = now,
                EndDate = now.AddMonths(3),
                Status = ShopSubscriptionStatus.Active,
                CreatedAt = now
            },
            new ShopSubscription
            {
                ShopId = shop3Id,
                PlanId = coBan.Id,
                StartDate = now,
                EndDate = now.AddMonths(1),
                Status = ShopSubscriptionStatus.Active,
                CreatedAt = now
            }
        };

        db.ShopSubscriptions.AddRange(subscriptions);
        await db.SaveChangesAsync();

        Console.WriteLine("  [Seed] Đã gán gói: Đà Lạt → Cao cấp ⭐, Miền Tây → Tiêu chuẩn ✨, Đồng Nai → Cơ bản");
    }
}
