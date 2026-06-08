# Backend Project Rules — Sàn Thương Mại Điện Tử Nông Sản

> **Đề tài:** Xây dựng website sàn thương mại điện tử đa người bán sử dụng ASP.NET Core và React.js  
> **Framework:** ASP.NET Core 8 Web API  
> **Kiến trúc:** Clean Architecture (Domain / Application / Infrastructure / API)

---

## 1. Tech Stack

| Hạng mục | Công nghệ | Phiên bản |
|----------|-----------|-----------|
| Framework | ASP.NET Core Web API | .NET 8 (LTS) |
| ORM | Entity Framework Core — Code First | 8.0.x |
| Database | SQL Server (LocalDB cho dev) | 2022 |
| Authentication | JWT Bearer (tự implement, không dùng ASP.NET Core Identity) | 8.0.x |
| Password hashing | BCrypt.Net-Next | 4.x |
| Authorization | ASP.NET Core Policy — Role-based | built-in |
| Object mapping | AutoMapper | 13.x |
| Validation | FluentValidation | 11.x |
| File storage | Cloudinary SDK | 6.x |
| Background job | Hangfire + Hangfire.SqlServer | 1.8.x |
| Realtime | SignalR | built-in |
| API docs | Swashbuckle (Swagger UI) | 6.x |

> **Lý do không dùng ASP.NET Core Identity:** Identity tự tạo 7 bảng riêng (`AspNetUsers`, `AspNetRoles`...) làm xáo trộn ERD đã thiết kế. Hệ thống chỉ có 3 role cố định (Buyer / Seller / Admin) — JWT thuần đủ dùng, dễ kiểm soát schema và dễ trình bày luận văn.

---

## 2. Cấu trúc Solution

```
NongSan.sln
├── NongSan.Domain          ← Entities, Enums, Interfaces, Common
├── NongSan.Application     ← Services (interface), DTOs, Validators, Mappings
├── NongSan.Infrastructure  ← DbContext, Repositories, JWT, BCrypt, Cloudinary, Hangfire
└── NongSan.API             ← Controllers, Middlewares, Extensions, Program.cs
```

**Quy tắc phụ thuộc (Dependency Rule):**
- `Domain` không phụ thuộc vào bất kỳ project nào khác
- `Application` chỉ phụ thuộc vào `Domain`
- `Infrastructure` phụ thuộc vào `Application`
- `API` phụ thuộc vào `Application` và `Infrastructure`
- **Tuyệt đối không** để `Domain` hoặc `Application` tham chiếu đến EF Core hay bất kỳ thư viện infrastructure nào

---

## 3. Kiến trúc xử lý Request

```
Request → Controller → Service (Application) → Repository (Infrastructure) → Database
                                              ↓
Response ← Controller ← DTO ← AutoMapper ← Entity
```

- **Controller** chỉ nhận request, gọi service, trả response — không chứa business logic
- **Service** chứa toàn bộ business logic, trả về `Result<T>`
- **Repository** chỉ thao tác với DB qua EF Core, không chứa logic nghiệp vụ

---

## 4. Naming Conventions

```csharp
// Interfaces: tiền tố I
IProductService, IShopRepository, ITokenService

// Classes, Methods: PascalCase
ProductService, CreateProductAsync, GetByIdAsync

// Private readonly fields: _camelCase
private readonly IProductService _productService;
private readonly AppDbContext _dbContext;

// Variables, Parameters: camelCase
var productDto = ...; 
public async Task<Result<ProductDto>> CreateAsync(CreateProductRequest request)

// DTOs:
CreateProductRequest    // Input từ client
ProductResponse         // Output trả về client
ProductDetailResponse   // Output chi tiết

// Controllers: tên số nhiều
ProductsController, ShopsController, OrdersController
```

---

## 5. Response Format chuẩn

Tất cả API endpoint trả về cấu trúc thống nhất:

```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": { }
}
```

```json
{
  "success": false,
  "message": "Sản phẩm không tồn tại",
  "data": null
}
```

Implement qua `ApiResponse<T>` wrapper:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Thành công")
        => new() { Success = true, Message = message, Data = data };

    public static ApiResponse<T> Fail(string message)
        => new() { Success = false, Message = message };
}
```

---

## 6. Result Pattern — Xử lý lỗi trong Service

Service không throw exception tràn lan. Mọi service method trả về `Result<T>`:

```csharp
public class Result<T>
{
    public bool IsSuccess { get; private set; }
    public T? Data { get; private set; }
    public string? Error { get; private set; }

    public static Result<T> Ok(T data) =>
        new() { IsSuccess = true, Data = data };

    public static Result<T> Fail(string error) =>
        new() { IsSuccess = false, Error = error };
}
```

Controller đọc Result và map sang ApiResponse:

```csharp
var result = await _productService.CreateAsync(request);

if (!result.IsSuccess)
    return BadRequest(ApiResponse<ProductResponse>.Fail(result.Error!));

return Ok(ApiResponse<ProductResponse>.Ok(result.Data!));
```

---

## 7. Entity Base Classes

Mọi entity phải kế thừa `BaseEntity` hoặc `AuditEntity`:

```csharp
// Domain/Common/BaseEntity.cs
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }  // Soft delete
}
```

---

## 8. Soft Delete

Không bao giờ xóa cứng dữ liệu nghiệp vụ. Chỉ điền `DeletedAt`:

```csharp
// Cấu hình Global Query Filter trong DbContext:
modelBuilder.Entity<Product>()
    .HasQueryFilter(p => p.DeletedAt == null);

// Khi "xóa":
entity.DeletedAt = DateTime.UtcNow;
await _dbContext.SaveChangesAsync();
// Không dùng _dbContext.Remove(entity)
```

Global Query Filter áp dụng cho: `Users`, `Addresses`, `Shops`, `Products`, `ProductVariants`, `Reviews`.

---

## 9. Authentication & Authorization

**Không dùng ASP.NET Core Identity.** Tự implement:

```csharp
// Payload JWT chứa:
// - UserId
// - Email
// - Role (Buyer | Seller | Admin)
// - ShopId (nếu là Seller)

// Phân quyền trên Controller:
[Authorize]                          // Đã đăng nhập
[Authorize(Roles = "Seller")]        // Chỉ Seller
[Authorize(Roles = "Admin")]         // Chỉ Admin
[Authorize(Roles = "Seller,Admin")]  // Seller hoặc Admin

// Lấy thông tin user trong Controller:
var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
var role = User.FindFirst(ClaimTypes.Role)!.Value;
```

**Quy tắc phân quyền theo dữ liệu:**
- Seller chỉ được thao tác trên Shop/Product/Order của chính mình — phải kiểm tra `ShopId` từ token
- Buyer chỉ được xem Order của chính mình — phải kiểm tra `UserId` từ token
- Admin được thao tác tất cả

---

## 10. EF Core — Quy tắc bắt buộc

```csharp
// KHÔNG dùng Raw SQL — luôn dùng LINQ:
// ❌ Sai:
var products = await _dbContext.Database
    .SqlQuery<Product>("SELECT * FROM Products").ToListAsync();

// ✅ Đúng:
var products = await _dbContext.Products
    .Where(p => p.ShopId == shopId)
    .Include(p => p.Variants)
    .ToListAsync();

// Luôn dùng async/await với DB:
// ❌ Sai:
var product = _dbContext.Products.FirstOrDefault(p => p.Id == id);

// ✅ Đúng:
var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id);

// Tránh N+1 query — luôn Include khi cần navigation property:
var orders = await _dbContext.ShopOrders
    .Include(o => o.OrderItems)
        .ThenInclude(i => i.Variant)
            .ThenInclude(v => v.Product)
    .Where(o => o.ShopId == shopId)
    .ToListAsync();
```

---

## 11. DTO Rules

- **Không bao giờ** trả Entity trực tiếp từ Controller
- Mỗi entity có ít nhất 2 DTO: `XxxRequest` (input) và `XxxResponse` (output)
- Snapshot fields trong `OrderItems` (`SnapshotName`, `SnapshotPrice`...) không được phép map ngược lại Entity

```csharp
// ❌ Sai — trả Entity trực tiếp:
return Ok(product);

// ✅ Đúng — map qua DTO:
var dto = _mapper.Map<ProductResponse>(product);
return Ok(ApiResponse<ProductResponse>.Ok(dto));
```

---

## 12. Validation Rules

Dùng FluentValidation. Validator đặt trong `Application/Validators/`:

```csharp
public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên sản phẩm không được để trống")
            .MaximumLength(200);

        RuleFor(x => x.BasePrice)
            .GreaterThan(0).WithMessage("Giá phải lớn hơn 0");

        RuleFor(x => x.Unit)
            .NotEmpty().WithMessage("Đơn vị không được để trống");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("Phải chọn danh mục");
    }
}
```

---

## 13. Async/Await

Bắt buộc dùng async/await ở mọi nơi có tương tác với Database, File I/O, HTTP call:

```csharp
// ✅ Tất cả service method phải async:
public async Task<Result<ProductResponse>> GetByIdAsync(int id)
public async Task<Result<ProductResponse>> CreateAsync(CreateProductRequest request)
public async Task<Result<bool>> DeleteAsync(int id)

// ✅ Controller action phải async:
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    var result = await _productService.GetByIdAsync(id);
    ...
}
```

---

## 14. Cấm kỵ — KHÔNG được làm

| # | Quy tắc |
|---|---------|
| 1 | KHÔNG dùng ASP.NET Core Identity |
| 2 | KHÔNG viết business logic trong Controller |
| 3 | KHÔNG trả Entity trực tiếp từ API — bắt buộc qua DTO |
| 4 | KHÔNG dùng Raw SQL — chỉ LINQ qua EF Core |
| 5 | KHÔNG xóa cứng (hard delete) dữ liệu nghiệp vụ — chỉ soft delete |
| 6 | KHÔNG viết synchronous method khi có tương tác DB hoặc I/O |
| 7 | KHÔNG để `Domain` hoặc `Application` phụ thuộc vào EF Core |
| 8 | KHÔNG commit connection string, JWT secret, API key lên Git |
| 9 | KHÔNG bỏ qua kiểm tra quyền sở hữu — Seller chỉ sửa data của mình |
| 10 | KHÔNG gọi nhiều service lồng nhau trong Controller — chỉ gọi 1 service |

---

## 15. Cấu hình appsettings

```json
{
  "ConnectionStrings": {
    "Default": "Server=(localdb)\\mssqllocaldb;Database=NongSanDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-min-32-characters",
    "Issuer": "NongSanAPI",
    "Audience": "NongSanClient",
    "ExpiresInDays": 7
  },
  "Cloudinary": {
    "CloudName": "",
    "ApiKey": "",
    "ApiSecret": ""
  },
  "Hangfire": {
    "DashboardPath": "/hangfire"
  }
}
```

> **Bảo mật:** Thêm `appsettings.Development.json` vào `.gitignore`. Dùng User Secrets cho dev local:  
> `dotnet user-secrets set "Jwt:Secret" "your-local-secret"`

---

## 16. HTTP Status Codes chuẩn

| Tình huống | Status Code |
|-----------|-------------|
| Thành công, trả dữ liệu | `200 OK` |
| Tạo mới thành công | `201 Created` |
| Không tìm thấy | `404 Not Found` |
| Dữ liệu không hợp lệ | `400 Bad Request` |
| Chưa đăng nhập | `401 Unauthorized` |
| Không có quyền | `403 Forbidden` |
| Lỗi server | `500 Internal Server Error` |
