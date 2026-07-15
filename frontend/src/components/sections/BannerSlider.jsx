import { useState, useEffect } from "react";

const banners = [
  { id: 1, title: "Mứt trái cây tươi", subtitle: "Từ vườn đến tay bạn", from: "#5A8A6A", to: "#A8D5B5" },
  { id: 2, title: "Cà phê sạch", subtitle: "Rang xay thủ công", from: "#6B7F70", to: "#D1DDD4" },
  { id: 3, title: "Trái cây sấy", subtitle: "Không chất bảo quản", from: "#1A2E1F", to: "#5A8A6A" },
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 max-w-6xl mt-[40px] flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3 relative rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] aspect-[16/5]">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 flex flex-col justify-center px-8 md:px-12 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ background: `linear-gradient(135deg, ${banner.from}, ${banner.to})` }}
          >
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
            <p className="text-white text-base md:text-xl opacity-90">{banner.subtitle}</p>
          </div>
        ))}
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-4">
        <div className="flex-1 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden bg-gradient-to-br from-[#A8D5B5] to-[#F0F7F2] p-6 flex flex-col justify-center aspect-square md:aspect-auto">
          <h3 className="text-[#1A2E1F] font-bold text-lg mb-1">Deal Hot</h3>
          <p className="text-[#5A8A6A]">Giảm đến 50%</p>
        </div>
        <div className="flex-1 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden bg-gradient-to-tr from-[#D1DDD4] to-[#F0F7F2] p-6 flex flex-col justify-center aspect-square md:aspect-auto">
          <h3 className="text-[#1A2E1F] font-bold text-lg mb-1">Freeship</h3>
          <p className="text-[#5A8A6A]">Đơn từ 199K</p>
        </div>
      </div>
    </div>
  );
}
