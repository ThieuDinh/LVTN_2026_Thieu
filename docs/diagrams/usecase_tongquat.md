# Biểu đồ Use Case tổng quát — Sàn TMĐT Nông sản đa gian hàng

## Các Actor trong hệ thống

| Actor | Mô tả | Entity / Enum liên quan |
|-------|-------|------------------------|
| **Khách (Guest)** | Người dùng chưa đăng nhập, chỉ có thể xem sản phẩm | — |
| **Người mua (Buyer)** | Người dùng đã đăng nhập với role Buyer, có thể mua hàng | `User` (Role = Buyer) |
| **Nhà vườn (Seller)** | Người dùng đã đăng nhập với role Seller, quản lý gian hàng | `User` (Role = Seller), `Shop` |
| **Quản trị viên (Admin)** | Quản lý toàn bộ hệ thống | `User` (Role = Admin) |

> **Ghi chú kế thừa:** Buyer và Seller kế thừa từ Guest → họ cũng có thể xem sản phẩm, tìm kiếm, xem danh mục...

---

## Use Case theo từng Actor

### 1. Khách (Guest) — Chưa đăng nhập

| STT | Use Case | Mô tả | Entity liên quan |
|-----|----------|-------|-----------------|
| UC01 | Đăng ký tài khoản | Tạo tài khoản mới (Buyer hoặc Seller) | `User` |
| UC02 | Đăng nhập | Xác thực bằng email/password | `User` |
| UC03 | Xem danh sách sản phẩm | Duyệt sản phẩm theo trang | `Product`, `ProductVariant` |
| UC04 | Tìm kiếm sản phẩm | Tìm theo tên, danh mục, giá | `Product`, `Category` |
| UC05 | Xem chi tiết sản phẩm | Xem thông tin, biến thể, thuộc tính | `Product`, `ProductVariant`, `ProductAttribute` |
| UC06 | Xem danh mục | Duyệt danh mục sản phẩm | `Category` |
| UC07 | Xem gian hàng | Xem thông tin và sản phẩm của gian hàng | `Shop`, `Product` |
| UC08 | Xem đánh giá sản phẩm | Đọc đánh giá từ người mua khác | `Review` |

---

### 2. Người mua (Buyer) — Kế thừa tất cả UC của Khách

| STT | Use Case | Mô tả | Entity liên quan |
|-----|----------|-------|-----------------|
| UC09 | Quản lý hồ sơ cá nhân | Cập nhật tên, SĐT, ảnh đại diện | `User` |
| UC10 | Quản lý địa chỉ | Thêm / sửa / xóa địa chỉ giao hàng | `Address` |
| UC11 | Thêm sản phẩm vào giỏ | Chọn biến thể, số lượng và thêm vào giỏ | `Cart`, `CartItem` |
| UC12 | Quản lý giỏ hàng | Xem, cập nhật số lượng, xóa sản phẩm trong giỏ | `Cart`, `CartItem` |
| UC13 | Đặt hàng | Chọn địa chỉ, phương thức thanh toán, xác nhận đơn | `Order`, `ShopOrder`, `OrderItem` |
| UC14 | Thanh toán trực tuyến | Thanh toán qua cổng thanh toán (VNPay, MoMo...) | `Payment` |
| UC15 | Theo dõi đơn hàng | Xem trạng thái đơn hàng theo thời gian thực | `ShopOrder` (`ShopOrderStatus`) |
| UC16 | Đánh giá sản phẩm | Viết đánh giá + cho điểm sau khi nhận hàng | `Review` |
| UC17 | Xem thông báo | Nhận thông báo về trạng thái đơn hàng | `Notification` |

---

### 3. Nhà vườn (Seller) — Kế thừa tất cả UC của Khách

| STT | Use Case | Mô tả | Entity liên quan |
|-----|----------|-------|-----------------|
| UC18 | Đăng ký mở gian hàng | Gửi yêu cầu mở gian hàng cho Admin duyệt | `Shop` (`ShopStatus`) |
| UC19 | Cập nhật thông tin gian hàng | Sửa tên, logo, mô tả, tỉnh thành | `Shop` |
| UC20 | Quản lý sản phẩm | Xem danh sách, bật/tắt sản phẩm | `Product` (`ProductStatus`) |
| UC21 | Thêm sản phẩm | Tạo sản phẩm mới với thông tin, biến thể, thuộc tính | `Product`, `ProductVariant`, `ProductAttribute` |
| UC22 | Quản lý biến thể | Thêm/sửa/xóa biến thể (kích cỡ, đóng gói) | `ProductVariant` |
| UC23 | Tạo phiếu nhập hàng | Ghi nhận lô hàng nhập kho mới | `ImportOrder`, `ImportOrderItem` |
| UC24 | Quản lý tồn kho | Xem số lượng tồn, hạn sử dụng theo lô | `ImportOrderItem`, `ProductVariant` |
| UC25 | Xác nhận đơn hàng | Xác nhận hoặc từ chối đơn hàng mới | `ShopOrder` |
| UC26 | Cập nhật trạng thái đơn | Chuyển trạng thái: Đang giao, Đã giao | `ShopOrder` (`ShopOrderStatus`) |
| UC27 | Xem doanh thu gian hàng | Xem doanh thu, hoa hồng, lợi nhuận | `PlatformRevenue` |
| UC28 | Xem thông báo | Nhận thông báo đơn mới, sản phẩm bị ẩn | `Notification` |

---

### 4. Quản trị viên (Admin)

| STT | Use Case | Mô tả | Entity liên quan |
|-----|----------|-------|-----------------|
| UC29 | Duyệt yêu cầu mở gian hàng | Phê duyệt hoặc từ chối yêu cầu mở Shop | `Shop` (`ShopStatus`) |
| UC30 | Khóa / Mở khóa gian hàng | Tạm ngưng hoặc mở lại hoạt động Shop | `Shop` (`ShopStatus`) |
| UC31 | Quản lý người dùng | Xem danh sách, tìm kiếm người dùng | `User` |
| UC32 | Khóa tài khoản | Vô hiệu hóa tài khoản vi phạm | `User` (`IsActive`) |
| UC33 | Quản lý danh mục | Thêm / sửa / xóa danh mục sản phẩm | `Category` |
| UC34 | Ẩn sản phẩm vi phạm | Ẩn sản phẩm không đạt tiêu chuẩn | `Product` (`ProductStatus`) |
| UC35 | Xem danh sách đơn hàng | Xem toàn bộ đơn hàng trên sàn | `Order`, `ShopOrder` |
| UC36 | Hủy đơn hàng | Hủy đơn hàng khi có tranh chấp | `ShopOrder` (`ShopOrderStatus`) |
| UC37 | Cài đặt tỷ lệ hoa hồng | Thiết lập % hoa hồng cho từng Shop | `Shop` (`CommissionRate`) |
| UC38 | Xem báo cáo doanh thu sàn | Xem tổng doanh thu, hoa hồng toàn sàn | `PlatformRevenue` |
| UC39 | Xem thông báo | Nhận thông báo gian hàng mới chờ duyệt | `Notification` |

---

## Quan hệ giữa các Use Case

| Quan hệ | Use Case gốc | Use Case liên quan | Loại |
|---------|--------------|-------------------|------|
| Đặt hàng bắt buộc phải có giỏ hàng | UC13 - Đặt hàng | UC12 - Quản lý giỏ hàng | `<<include>>` |
| Đặt hàng có thể thanh toán online | UC13 - Đặt hàng | UC14 - Thanh toán trực tuyến | `<<extend>>` |
| Quản lý sản phẩm bao gồm thêm SP | UC20 - Quản lý sản phẩm | UC21 - Thêm sản phẩm | `<<include>>` |
| Quản lý sản phẩm bao gồm biến thể | UC20 - Quản lý sản phẩm | UC22 - Quản lý biến thể | `<<include>>` |
| Quản lý người dùng bao gồm khóa TK | UC31 - Quản lý người dùng | UC32 - Khóa tài khoản | `<<include>>` |

---

## Cách render file PlantUML

File `usecase_tongquat.puml` có thể được render thành hình ảnh bằng các cách sau:
1. **VS Code**: Cài extension "PlantUML" → Nhấn `Alt + D` để xem preview
2. **Online**: Truy cập https://www.plantuml.com/plantuml/uml → Dán nội dung file vào
3. **Command line**: `java -jar plantuml.jar usecase_tongquat.puml`
