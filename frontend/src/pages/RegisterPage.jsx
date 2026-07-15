import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Eye, EyeSlash, Leaf, Storefront, ShieldCheck } from '@phosphor-icons/react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If token already exists, redirect directly to homepage
    const token = localStorage.getItem('nongsan_token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side confirmation check
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Phone format check (must be 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('Số điện thoại không hợp lệ (yêu cầu đúng 10 chữ số).');
      return;
    }

    setLoading(true);

    try {
      await authService.register(fullName.trim(), email.trim(), password, phone.trim());
    } catch (err) {
      setError(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-white font-sans text-[#1A2E1F]">
      {/* Left Column: Brand & Benefits Block (Hidden on mobile) */}
      <div className="hidden md:flex md:col-span-5 flex-col justify-between p-12 bg-[#F0F7F2] border-r border-[#D1DDD4]">
        <div className="flex items-center gap-2 text-[#5A8A6A]">
          <Leaf weight="fill" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">NôngSảnSạch</span>
        </div>

        <div className="space-y-8 my-auto">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#1A2E1F] leading-tight">
              Đặc sản Việt chất lượng cao trực tiếp từ nhà vườn
            </h2>
            <p className="text-sm text-[#6B7F70] leading-relaxed">
              Trở thành nhà cung cấp hoặc khách hàng thông minh trên hệ thống phân phối đặc sản nông nghiệp lớn nhất Việt Nam.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5A8A6A]" />
              <span className="text-sm font-medium text-[#1A2E1F]">Sản phẩm sạch 100% kiểm định an toàn</span>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-[#5A8A6A]" />
              <span className="text-sm font-medium text-[#1A2E1F]">Giá gốc từ hợp tác xã sản xuất</span>
            </div>
            <div className="flex items-center gap-3">
              <Storefront className="w-5 h-5 text-[#5A8A6A]" />
              <span className="text-sm font-medium text-[#1A2E1F]">Hỗ trợ hàng trăm gian hàng nhà vườn Việt</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#6B7F70]">
          &copy; {new Date().getFullYear()} NôngSảnSạch. Bảo lưu mọi quyền.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="col-span-12 md:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#1A2E1F]">
              Đăng ký tài khoản
            </h1>
            <p className="text-sm text-[#6B7F70]">
              Tạo tài khoản để bắt đầu trải nghiệm đặc sản nông sản Việt ngay hôm nay.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#6B7F70]" htmlFor="fullName">
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-[15px] px-4 py-2.5 rounded-[8px] border border-[#D1DDD4] bg-white text-[#1A2E1F] outline-none transition-all focus:border-[#5A8A6A] focus:bg-[#F0F7F2]/10 focus:ring-[3px] focus:ring-[#5A8A6A]/15"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#6B7F70]" htmlFor="email">
                Địa chỉ Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[15px] px-4 py-2.5 rounded-[8px] border border-[#D1DDD4] bg-white text-[#1A2E1F] outline-none transition-all focus:border-[#5A8A6A] focus:bg-[#F0F7F2]/10 focus:ring-[3px] focus:ring-[#5A8A6A]/15"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#6B7F70]" htmlFor="phone">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-[15px] px-4 py-2.5 rounded-[8px] border border-[#D1DDD4] bg-white text-[#1A2E1F] outline-none transition-all focus:border-[#5A8A6A] focus:bg-[#F0F7F2]/10 focus:ring-[3px] focus:ring-[#5A8A6A]/15"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#6B7F70]" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-[15px] px-4 py-2.5 pr-10 rounded-[8px] border border-[#D1DDD4] bg-white text-[#1A2E1F] outline-none transition-all focus:border-[#5A8A6A] focus:bg-[#F0F7F2]/10 focus:ring-[3px] focus:ring-[#5A8A6A]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7F70] hover:text-[#1A2E1F] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#6B7F70]" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-[15px] px-4 py-2.5 pr-10 rounded-[8px] border border-[#D1DDD4] bg-white text-[#1A2E1F] outline-none transition-all focus:border-[#5A8A6A] focus:bg-[#F0F7F2]/10 focus:ring-[3px] focus:ring-[#5A8A6A]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7F70] hover:text-[#1A2E1F] transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="text-[13px] text-[#C0392B] bg-red-55/10 p-3 rounded-[8px] border border-red-200/50">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A8A6A] hover:bg-[#4d755a] text-white py-2.5 px-4 rounded-[8px] font-medium text-[15px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          {/* Login Redirect Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-[#6B7F70]">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-[#5A8A6A] hover:text-[#4d755a] transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
