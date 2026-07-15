import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash, Plus, Minus, Storefront, Warning, ArrowRight,
} from '@phosphor-icons/react';
import { cartService } from '../services/cartService';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('nongsan_token');
    if (!token) { navigate('/login'); return; }
    cartService.getCart().then(setCart).catch(() => {}).finally(() => setLoading(false));

    const handler = () => cartService.getCart().then(setCart).catch(() => {});
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, [navigate]);

  const handleUpdateQty = async (itemId, qty) => {
    if (qty < 1) return;
    setActionLoading(itemId);
    try {
      const updated = await cartService.updateItem(itemId, qty);
      setCart(updated);
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const handleRemove = async (itemId) => {
    setActionLoading(itemId);
    try {
      const updated = await cartService.removeItem(itemId);
      setCart(updated);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const handleClear = async () => {
    if (!window.confirm('Xoá toàn bộ giỏ hàng?')) return;
    try {
      await cartService.clearCart();
      setCart({ id: cart.id, items: [], totalAmount: 0, totalItems: 0 });
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) { alert(err.message); }
  };

  // Group items by shop
  const groupByShop = (items) => {
    const groups = {};
    items?.forEach((item) => {
      const key = item.shopId;
      if (!groups[key]) groups[key] = { shopName: item.shopName, shopId: key, items: [] };
      groups[key].items.push(item);
    });
    return Object.values(groups);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[#F0F7F2] rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const groups = groupByShop(cart?.items);
  const isEmpty = !cart?.items?.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A2E1F]">Giỏ hàng ({cart?.totalItems || 0})</h1>
        {!isEmpty && (
          <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700 transition-colors">
            Xoá tất cả
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-white rounded-2xl border border-[#D1DDD4] py-16 text-center">
          <ShoppingCart size={56} className="mx-auto mb-4 text-[#D1DDD4]" />
          <p className="text-lg font-medium text-[#1A2E1F] mb-1">Giỏ hàng trống</p>
          <p className="text-sm text-[#9EAFA3] mb-6">Hãy khám phá và thêm sản phẩm vào giỏ!</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5A8A6A] text-white rounded-xl text-sm font-medium hover:bg-[#4a7257] transition-colors">
            Mua sắm ngay <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {groups.map((group) => (
              <div key={group.shopId} className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-[#F0F7F2] border-b border-[#D1DDD4] flex items-center gap-2">
                  <Storefront size={16} className="text-[#5A8A6A]" />
                  <span className="font-semibold text-sm text-[#1A2E1F]">{group.shopName}</span>
                </div>
                <div className="divide-y divide-[#D1DDD4]">
                  {group.items.map((item) => (
                    <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl bg-[#F0F7F2] shrink-0 overflow-hidden flex items-center justify-center">
                        {item.images ? (
                          <img src={item.images} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart size={24} className="text-[#D1DDD4]" />
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1A2E1F] text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-[#9EAFA3]">{item.variantName} · {item.sku}</p>
                        <p className="text-[#5A8A6A] font-semibold text-sm mt-0.5">{fmtPrice(item.price)}</p>
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || actionLoading === item.id}
                          className="w-8 h-8 rounded-lg border border-[#D1DDD4] flex items-center justify-center text-[#6B7F70] hover:bg-[#F0F7F2] disabled:opacity-40 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#1A2E1F]">{item.quantity}</span>
                        <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock || actionLoading === item.id}
                          className="w-8 h-8 rounded-lg border border-[#D1DDD4] flex items-center justify-center text-[#6B7F70] hover:bg-[#F0F7F2] disabled:opacity-40 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      {/* Line total */}
                      <div className="text-right shrink-0 w-28">
                        <p className="font-bold text-[#1A2E1F]">{fmtPrice(item.lineTotal)}</p>
                      </div>
                      {/* Remove */}
                      <button onClick={() => handleRemove(item.id)} disabled={actionLoading === item.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 shrink-0">
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-[#D1DDD4] p-5 shadow-sm sticky top-8 space-y-4">
              <h2 className="font-bold text-[#1A2E1F]">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B7F70]">
                  <span>Số lượng sản phẩm</span>
                  <span className="font-medium text-[#1A2E1F]">{cart.totalItems}</span>
                </div>
                <div className="flex justify-between text-[#6B7F70]">
                  <span>Tạm tính</span>
                  <span className="font-medium text-[#1A2E1F]">{fmtPrice(cart.totalAmount)}</span>
                </div>
              </div>
              <div className="border-t border-[#D1DDD4] pt-3 flex justify-between items-center">
                <span className="font-semibold text-[#1A2E1F]">Tổng cộng</span>
                <span className="text-xl font-bold text-[#5A8A6A]">{fmtPrice(cart.totalAmount)}</span>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-[#5A8A6A] hover:bg-[#4a7257] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                Tiến hành thanh toán <ArrowRight size={16} />
              </button>
              <Link to="/products" className="block text-center text-sm text-[#5A8A6A] hover:underline">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
