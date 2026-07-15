import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopService } from '../services/shopService';

export default function SellerRegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    description: '',
    logo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('nongsan_token');
    if (!token) {
      navigate('/login?redirect=/seller/register');
      return;
    }
    
    // Check if they already have a shop
    shopService.getMyShop().then(shop => {
      if (shop) {
        if (shop.status === 'Pending') {
          setIsSuccess(true);
        } else if (shop.status === 'Active') {
          // If they already have an active shop, they should go to dashboard
          // (They might need to relogin, but if they click TopBar it might still lead here)
          const userStr = localStorage.getItem('nongsan_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'Seller') {
              navigate('/seller/dashboard');
              return;
            } else {
              // They are approved but JWT is old! Force relogin or inform them
              alert("Gian hàng của bạn đã được duyệt! Vui lòng đăng xuất và đăng nhập lại để truy cập Kênh Người Bán.");
              window.location.href = "/login";
            }
          }
        }
      }
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên gian hàng');
      return;
    }
    
    try {
      setLoading(true);
      await shopService.createShop(formData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F0F7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-[12px] border border-[#D1DDD4] shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2E1F] mb-2">Đăng ký thành công!</h2>
          <p className="text-[#6B7F70] mb-6">
            Yêu cầu mở gian hàng của bạn đã được gửi. Vui lòng chờ Admin phê duyệt. Bạn sẽ có thể truy cập trang quản lý gian hàng sau khi được duyệt.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 bg-[#5A8A6A] text-white rounded-lg font-medium hover:bg-[#4a7257] transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-[12px] border border-[#D1DDD4] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-8">
          <h2 className="text-[28px] font-bold text-[#1A2E1F]">
            Đăng ký trở thành Nhà Bán Hàng
          </h2>
          <p className="text-[#6B7F70] mt-2 text-sm">
            Mở gian hàng NôngSan để mang nông sản Việt đến mọi nhà
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1A2E1F] mb-1">
              Tên gian hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Nông Trại Xanh Đà Lạt"
              className="w-full px-4 py-2 border border-[#D1DDD4] rounded-lg outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors text-[#1A2E1F]"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-[#1A2E1F] mb-1">
              Tỉnh/Thành phố
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              placeholder="VD: Lâm Đồng"
              className="w-full px-4 py-2 border border-[#D1DDD4] rounded-lg outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors text-[#1A2E1F]"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-[#1A2E1F] mb-1">
              Logo (URL hình ảnh)
            </label>
            <input
              type="text"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-[#D1DDD4] rounded-lg outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors text-[#1A2E1F]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#1A2E1F] mb-1">
              Mô tả gian hàng
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Giới thiệu về gian hàng và các mặt hàng nông sản của bạn..."
              rows={4}
              className="w-full px-4 py-2 border border-[#D1DDD4] rounded-lg outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors text-[#1A2E1F] resize-none"
              maxLength={2000}
            />
          </div>

          <div className="pt-4 border-t border-[#D1DDD4]">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-[#5A8A6A] text-white rounded-lg font-medium hover:bg-[#4a7257] transition-colors flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
