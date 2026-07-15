import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api';

// Map of icons for fallback/design
const categoryIcons = ["🍓", "☕", "🍊", "🍯", "🌾", "🎁", "🥗", "🥥", "🌶️", "🍄"];

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data.slice(0, 12)); // Take up to 12 categories
        }
      })
      .catch(err => console.error("Failed to fetch categories:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-6xl mt-[40px]">
        <div className="mb-6"><h2 className="text-[#1A2E1F] uppercase font-semibold text-xl border-l-[3px] border-[#5A8A6A] pl-[12px]">Danh mục</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({length: 6}).map((_, i) => (
             <div key={i} className="h-32 bg-[#F0F7F2] rounded-xl animate-pulse border border-[#D1DDD4]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="container mx-auto px-4 max-w-6xl mt-[40px]">
      <div className="mb-6">
        <h2 className="text-[#1A2E1F] uppercase font-semibold text-xl border-l-[3px] border-[#5A8A6A] pl-[12px]">
          Danh mục
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map((cat, index) => {
          const icon = categoryIcons[index % categoryIcons.length];
          return (
            <Link 
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="flex flex-col items-center justify-center p-4 bg-white border border-[#D1DDD4] rounded-xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all group hover:border-[#A8D5B5]"
            >
              <div className="w-16 h-16 rounded-full bg-[#F0F7F2] group-hover:bg-[#A8D5B5] transition-colors flex items-center justify-center text-3xl mb-3">
                {icon}
              </div>
              <span className="text-[#1A2E1F] font-medium text-sm text-center group-hover:text-[#5A8A6A] transition-colors line-clamp-2">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
