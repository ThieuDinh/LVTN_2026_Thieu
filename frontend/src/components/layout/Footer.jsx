import { Link } from "react-router-dom";
import { FacebookLogo, InstagramLogo, YoutubeLogo } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-[#1A2E1F] text-white mt-[40px] pt-12">
      <div className="container mx-auto px-4 max-w-6xl pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="text-[28px] font-bold tracking-tight mb-4 inline-block">
            <span className="text-[#A8D5B5]">Nông</span>
            <span className="text-white">San</span>
          </Link>
          <p className="text-[#D1DDD4] text-sm mb-6 leading-relaxed">
            Sàn thương mại điện tử chuyên cung cấp nông sản Việt Nam chất lượng cao, an toàn.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[#D1DDD4] hover:text-[#A8D5B5] transition-colors">
              <FacebookLogo size={24} weight="fill" />
            </a>
            <a href="#" className="text-[#D1DDD4] hover:text-[#A8D5B5] transition-colors">
              <InstagramLogo size={24} weight="fill" />
            </a>
            <a href="#" className="text-[#D1DDD4] hover:text-[#A8D5B5] transition-colors">
              <YoutubeLogo size={24} weight="fill" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#A8D5B5]">Về chúng tôi</h3>
          <ul className="space-y-3 text-sm text-[#D1DDD4]">
            <li><Link to="/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
            <li><Link to="/careers" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
            <li><Link to="/news" className="hover:text-white transition-colors">Tin tức</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#A8D5B5]">Hỗ trợ</h3>
          <ul className="space-y-3 text-sm text-[#D1DDD4]">
            <li><Link to="/help" className="hover:text-white transition-colors">Trung tâm trợ giúp</Link></li>
            <li><Link to="/returns" className="hover:text-white transition-colors">Chính sách đổi trả</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-[#A8D5B5]">Mở gian hàng</h3>
          <p className="text-[#D1DDD4] text-sm mb-4">
            Trở thành nhà bán hàng trên NôngSan ngay hôm nay.
          </p>
          <Link to="/seller/register" className="inline-block bg-[#5A8A6A] hover:bg-[#A8D5B5] hover:text-[#1A2E1F] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Đăng ký bán hàng
          </Link>
        </div>
      </div>
      
      <div className="border-t border-[#6B7F70] py-4 text-center text-sm text-[#D1DDD4]">
        <p>&copy; {new Date().getFullYear()} NôngSan. All rights reserved.</p>
      </div>
    </footer>
  );
}
