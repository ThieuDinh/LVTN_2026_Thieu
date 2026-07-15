import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/products?sort=popular&limit=8`);
        if (res.ok) {
          const resData = await res.json();
          const items = resData?.data?.items || resData?.data || resData?.items || (Array.isArray(resData) ? resData : []);
          setProducts(Array.isArray(items) ? items : []);
        } else {
          setProducts(Array(8).fill(null).map((_, i) => ({
            id: i,
            name: `Sản phẩm nông sản mẫu ${i+1}`,
            price: 199000,
            shopName: "Nông trại xanh",
            image: null
          })));
        }
      } catch (error) {
        setProducts(Array(8).fill(null).map((_, i) => ({
          id: i,
          name: `Sản phẩm nông sản mẫu ${i+1}`,
          price: 199000,
          shopName: "Nông trại xanh",
          image: null
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl mt-[40px] mb-[40px]">
      <div className="mb-6">
        <h2 className="text-[#1A2E1F] uppercase font-semibold text-xl border-l-[3px] border-[#5A8A6A] pl-[12px]">
          Sản phẩm nổi bật
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array(8).fill(null).map((_, i) => (
            <div key={i} className="border border-[#D1DDD4] rounded-xl overflow-hidden animate-pulse">
              <div className="w-full aspect-square bg-[#F0F7F2]"></div>
              <div className="p-4">
                <div className="h-4 bg-[#D1DDD4] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#D1DDD4] rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-[#D1DDD4] rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-[#D1DDD4] rounded w-1/4 mb-4"></div>
                <div className="h-9 bg-[#D1DDD4] rounded w-full"></div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`}
              className="border border-[#D1DDD4] rounded-xl overflow-hidden hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow group bg-white flex flex-col"
            >
              <div className="w-full aspect-square bg-[#F0F7F2] flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">🌿</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#1A2E1F] font-medium text-sm line-clamp-2 h-10 mb-1 group-hover:text-[#5A8A6A] transition-colors">
                  {product.name}
                </h3>
                <div className="text-[#5A8A6A] font-semibold text-lg mb-1">
                  {formatPrice(product.price || product.basePrice)}
                </div>
                <div className="text-[#6B7F70] text-xs mb-3 flex-1">
                  {product.shopName || `Gian hàng #${product.shopId}`}
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full border border-[#5A8A6A] text-[#5A8A6A] bg-transparent rounded-lg py-1.5 text-sm font-medium hover:bg-[#5A8A6A] hover:text-white transition-colors"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
