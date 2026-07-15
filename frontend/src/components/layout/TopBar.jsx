import { Link } from "react-router-dom";
import { User, CaretDown } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("nongsan_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("nongsan_user");
    localStorage.removeItem("nongsan_token");
    window.location.href = "/";
  };

  return (
    <div className="bg-[#F0F7F2] text-[#6B7F70] text-[12px] py-2 border-b border-[#D1DDD4]">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
        <div className="flex gap-4">
          <Link 
            to={user?.role === 'Seller' || user?.role === 'Admin' ? "/seller/dashboard" : "/seller/register"} 
            className="hover:text-[#5A8A6A] transition-colors"
          >
            Kênh Người Bán
          </Link>
          <span className="text-[#D1DDD4]">|</span>
          <a href="#" className="hover:text-[#5A8A6A] transition-colors">
            Tải ứng dụng
          </a>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="relative group cursor-pointer flex items-center gap-2 hover:text-[#5A8A6A] transition-colors">
              <User size={14} weight="fill" />
              <span>{user.fullName || "Tài khoản"}</span>
              <CaretDown size={12} />
              
              <div className="absolute top-full right-0 pt-2 w-40 hidden group-hover:block z-50">
                <div className="bg-white border border-[#D1DDD4] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] py-2">
                <Link to="/account" className="block px-4 py-2 hover:bg-[#F0F7F2] hover:text-[#5A8A6A] text-[#1A2E1F]">
                  Tài khoản của tôi
                </Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-[#F0F7F2] hover:text-[#5A8A6A] text-[#1A2E1F]">
                  Đơn hàng
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-[#F0F7F2] hover:text-[#5A8A6A] text-[#1A2E1F]">
                  Đăng xuất
                </button>
              </div>
            </div>
            </div>
          ) : (
            <>
              <Link to="/register" className="hover:text-[#5A8A6A] transition-colors">
                Đăng ký
              </Link>
              <span className="text-[#D1DDD4]">|</span>
              <Link to="/login" className="hover:text-[#5A8A6A] transition-colors">
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
