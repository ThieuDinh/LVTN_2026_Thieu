import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Storefront, 
  SquaresFour, 
  Package, 
  ShoppingCart, 
  Gear, 
  SignOut,
  Bell,
  MagnifyingGlass
} from '@phosphor-icons/react';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('Gian Hàng Của Bạn');

  useEffect(() => {
    const userStr = localStorage.getItem('nongsan_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if ((user.role !== 'Seller' && user.role !== 'Admin') || (!user.shopId && user.role !== 'Admin')) {
      alert("Tài khoản của bạn chưa được cấp quyền quản lý gian hàng hoặc gian hàng đang chờ Admin duyệt. Vui lòng đăng xuất và đăng nhập lại nếu bạn vừa được duyệt!");
      navigate('/'); 
      return;
    }
    setShopName(user.fullName || 'Gian Hàng');
  }, [navigate]);

  const navItems = [
    { name: 'Tổng quan', path: '/seller/dashboard', icon: <SquaresFour weight={location.pathname === '/seller/dashboard' ? 'fill' : 'regular'} size={24} /> },
    { name: 'Sản phẩm', path: '/seller/products', icon: <Package weight={location.pathname.includes('/seller/products') ? 'fill' : 'regular'} size={24} /> },
    { name: 'Đơn hàng', path: '/seller/orders', icon: <ShoppingCart weight={location.pathname.includes('/seller/orders') ? 'fill' : 'regular'} size={24} /> },
    { name: 'Nhập kho', path: '/seller/imports', icon: <Package weight={location.pathname.includes('/seller/imports') ? 'fill' : 'regular'} size={24} /> },
    { name: 'Thiết lập', path: '/seller/settings', icon: <Gear weight={location.pathname.includes('/seller/settings') ? 'fill' : 'regular'} size={24} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("nongsan_user");
    localStorage.removeItem("nongsan_token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#F0F7F2] font-sans text-[#1A2E1F] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-[#D1DDD4] flex flex-col transition-all">
        <div className="h-[72px] flex items-center px-6 border-b border-[#D1DDD4]">
          <Link to="/" className="flex items-center gap-2 text-[#5A8A6A] hover:opacity-80 transition-opacity">
            <Storefront weight="fill" size={32} />
            <span className="text-xl font-bold tracking-tight">Kênh Người Bán</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/seller/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#5A8A6A] text-white shadow-[0_4px_12px_rgba(90,138,106,0.3)]' 
                    : 'text-[#6B7F70] hover:bg-[#F0F7F2] hover:text-[#1A2E1F]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#D1DDD4]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-[#C0392B] hover:bg-red-50 transition-colors"
          >
            <SignOut size={24} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-[#D1DDD4] flex items-center justify-between px-8 shrink-0">
          <div className="w-[400px] relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7F70]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã đơn hàng, sản phẩm..." 
              className="w-full bg-[#F0F7F2] border border-[#D1DDD4] text-[#1A2E1F] placeholder-[#6B7F70] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-[#6B7F70] hover:text-[#5A8A6A] transition-colors">
              <Bell size={24} weight="fill" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C0392B] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#D1DDD4]"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-[#1A2E1F] group-hover:text-[#5A8A6A] transition-colors">{shopName}</p>
                <p className="text-xs text-[#6B7F70]">Chủ gian hàng</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#A8D5B5] flex items-center justify-center text-[#1A2E1F] font-bold overflow-hidden border-2 border-white shadow-sm">
                {shopName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
