import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MagnifyingGlass, Funnel, ShoppingCart, Package } from '@phosphor-icons/react';
import { cartService } from '../services/cartService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  // Fetch categories once
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (categoryId) params.set('categoryId', categoryId);
    if (sortBy) params.set('sortBy', sortBy);
    params.set('page', page);
    params.set('pageSize', pageSize);

    fetch(`${API_URL}/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProducts(d.data.items);
          setTotalCount(d.data.totalCount);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, categoryId, sortBy, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('nongsan_token');
    if (!token) { window.location.href = '/login'; return; }
    if (!product.variants?.length) return alert('Sản phẩm chưa có biến thể');
    setAddingToCart(product.id);
    try {
      await cartService.addItem(product.variants[0].id, 1);
      // Dispatch cart update event
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingToCart(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#5A8A6A] font-semibold">Danh mục nông sản</p>
        <h1 className="text-3xl font-bold text-[#1A2E1F]">Tất cả sản phẩm</h1>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9EAFA3]" />
          <input
            defaultValue={keyword}
            onKeyDown={(e) => { if (e.key === 'Enter') setParam('keyword', e.target.value); }}
            placeholder="Tìm kiếm sản phẩm, nhà vườn..."
            className="w-full bg-white border border-[#D1DDD4] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A2E1F] placeholder-[#9EAFA3] focus:outline-none focus:border-[#5A8A6A]"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <Funnel size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9EAFA3] pointer-events-none" />
          <select
            value={categoryId}
            onChange={(e) => setParam('categoryId', e.target.value)}
            className="appearance-none bg-white border border-[#D1DDD4] rounded-xl pl-8 pr-8 py-2.5 text-sm text-[#1A2E1F] focus:outline-none focus:border-[#5A8A6A] cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setParam('sortBy', e.target.value)}
          className="appearance-none bg-white border border-[#D1DDD4] rounded-xl px-4 py-2.5 text-sm text-[#1A2E1F] focus:outline-none focus:border-[#5A8A6A] cursor-pointer"
        >
          <option value="">Mới nhất</option>
          <option value="price">Giá tăng dần</option>
          <option value="name">Tên A-Z</option>
          <option value="bestseller">Bán chạy</option>
        </select>
      </div>

      {/* Category pills (quick select) */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setParam('categoryId', '')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!categoryId ? 'bg-[#5A8A6A] text-white border-[#5A8A6A]' : 'bg-white text-[#6B7F70] border-[#D1DDD4] hover:border-[#5A8A6A]'}`}>
            Tất cả
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setParam('categoryId', String(c.id))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${categoryId === String(c.id) ? 'bg-[#5A8A6A] text-white border-[#5A8A6A]' : 'bg-white text-[#6B7F70] border-[#D1DDD4] hover:border-[#5A8A6A]'}`}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-[#9EAFA3]">Tìm thấy <span className="font-semibold text-[#1A2E1F]">{totalCount}</span> sản phẩm</p>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden">
              <div className="h-48 bg-[#F0F7F2] animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#F0F7F2] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#F0F7F2] rounded animate-pulse w-1/2" />
                <div className="h-5 bg-[#F0F7F2] rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#9EAFA3]">
          <Package size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-lg">Không tìm thấy sản phẩm</p>
          <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const minPrice = product.variants?.length
              ? Math.min(...product.variants.map((v) => v.price))
              : product.basePrice;
            const img = product.variants?.[0]?.images;
            const sub = product.subscription;

            return (
              <div key={product.id} className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden shadow-sm hover:shadow-md hover:border-[#5A8A6A]/30 transition-all group relative">
                {/* Subscription Badge */}
                {sub && (
                  <div
                    className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wide shadow-md"
                    style={{
                      background: sub.boostScore >= 100
                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                        : 'linear-gradient(135deg, #5A8A6A, #3D7A5A)',
                      animation: sub.boostScore >= 100 ? 'subtlePulse 2s ease-in-out infinite' : 'none'
                    }}
                  >
                    <span>{sub.boostScore >= 100 ? '⭐' : '✨'}</span>
                    <span>{sub.planName}</span>
                  </div>
                )}
                <Link to={`/products/${product.id}`} className="block">
                  <div className="h-48 bg-[#F0F7F2] flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Package size={48} className="text-[#D1DDD4]" />
                    )}
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="font-medium text-[#1A2E1F] text-sm line-clamp-2 group-hover:text-[#5A8A6A] transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-[#9EAFA3]">{product.unit}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#5A8A6A] font-bold">{fmtPrice(minPrice)}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart === product.id}
                      className="p-2 rounded-lg bg-[#5A8A6A] text-white hover:bg-[#4a7257] transition-colors disabled:opacity-50"
                      title="Thêm vào giỏ"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setParam('page', String(p))}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#5A8A6A] text-white' : 'bg-white text-[#6B7F70] border border-[#D1DDD4] hover:border-[#5A8A6A]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
