import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass, ShoppingCart } from "@phosphor-icons/react";
import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5151/api";

export default function Header() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  const fetchCartCount = useCallback(() => {
    const token = localStorage.getItem("nongsan_token");
    if (!token) { setCartCount(0); return; }
    fetch(`${API_URL}/carts`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setCartCount(d.data.totalItems || 0); })
      .catch(() => setCartCount(0));
  }, []);

  useEffect(() => {
    fetchCartCount();
    window.addEventListener("cart-updated", fetchCartCount);
    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, [fetchCartCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?keyword=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <header className="bg-white py-[12px] border-b border-[#D1DDD4]">
      <div className="container mx-auto px-4 flex items-center justify-between max-w-6xl">
        <Link to="/" className="text-[28px] font-bold tracking-tight">
          <span className="text-[#5A8A6A]">Nông</span>
          <span className="text-[#1A2E1F]">San</span>
        </Link>
        
        <form onSubmit={handleSearch} className="w-1/2 flex items-center border-2 border-[#5A8A6A] rounded-lg overflow-hidden">
          <input 
            type="text" 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm sản phẩm nông sản..." 
            className="w-full px-4 py-2 outline-none text-[#1A2E1F] placeholder-[#6B7F70]"
          />
          <button type="submit" className="bg-[#5A8A6A] text-white px-6 py-2 hover:bg-[#4a7257] transition-colors flex items-center justify-center h-full">
            <MagnifyingGlass size={20} weight="bold" />
          </button>
        </form>

        <Link to="/cart" className="relative text-[#5A8A6A] hover:text-[#4a7257] transition-colors p-2">
          <ShoppingCart size={28} weight="fill" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
