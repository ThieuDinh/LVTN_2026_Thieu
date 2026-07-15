import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[calc(100dvh-64px)] flex items-center bg-zinc-50 dark:bg-zinc-950 py-12 lg:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="space-y-6 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-600 font-semibold">
              Nông sản sạch 100% hữu cơ
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              Mang hương vị ngọt lành <br />
              <span className="text-emerald-600">từ vườn nhà</span> tới bàn ăn
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[45ch]">
              Trải nghiệm các loại nông sản đạt chuẩn organic VietGAP được thu hoạch tươi sạch trực tiếp từ các hợp tác xã miền Tây.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/products">
                <Button size="lg">Mua ngay</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="lg">Tìm hiểu thêm</Button>
              </Link>
            </div>
          </div>
          {/* Right Column: Hero Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <img 
              src="https://picsum.photos/seed/organic-harvest/800/600" 
              alt="Fresh organic agricultural products" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
