graph TD
    SYS[Hệ thống Sàn TMĐT Nông sản]
    
    %% Phân hệ Người mua
    SYS --> B[Phân hệ Người Mua]
    B --> B1[Tài khoản & Địa chỉ] 
    B --> B2[Mua sắm & Giỏ hàng] 
    B --> B3[Đặt hàng & Thanh toán] 
    B --> B4[Theo dõi Đơn & Đánh giá] 

    %% Phân hệ Nhà vườn
    SYS --> S[Phân hệ Nhà Vườn]
    S --> S1[Quản lý Gian hàng] 
    S --> S2[Quản lý Sản phẩm] 
    S --> S3[Nhập hàng & Kho] 
    S --> S4[Xử lý Đơn hàng] 
    S --> S5[Doanh thu & Lợi nhuận] 

    %% Phân hệ Quản trị
    SYS --> A[Phân hệ Quản Trị]
    A --> A1[Quản lý Gian hàng] 
    A --> A2[Quản lý Người dùng] 
    A --> A3[Danh mục & Sản phẩm] 
    A --> A4[Đơn hàng & Khiếu nại] 
    A --> A5[Báo cáo Doanh thu sàn]