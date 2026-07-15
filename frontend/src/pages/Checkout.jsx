import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { orderService } from '../services/order';
import { userService } from '../services/userService';
import { Button } from '../components/ui/Button';
import { CheckCircle, ArrowLeft, MapPin, Plus } from '@phosphor-icons/react';

export const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartData, addrData] = await Promise.all([
          cartService.getCart(),
          userService.getAddresses()
        ]);
        setCart(cartData);
        setAddresses(addrData);
        if (addrData.length > 0) {
          const defaultAddr = addrData.find(a => a.isDefault) || addrData[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.error(err);
        alert('Không thể tải dữ liệu thanh toán');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        AddressId: selectedAddressId,
        PaymentMethod: 'COD',
        Note: ''
      };

      const result = await orderService.createOrder(orderData);
      setOrderSuccess(result);
      window.dispatchEvent(new Event('cart-updated')); // clear cart badge
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Lỗi khi thanh toán');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Đang tải thông tin thanh toán...</div>;

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle weight="fill" className="w-16 h-16 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Đặt hàng thành công!</h2>
          <p className="text-zinc-500 text-sm">
            Mã đơn hàng của bạn là <strong className="text-zinc-800 dark:text-zinc-200">{orderSuccess.id}</strong>.
            Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.
          </p>
        </div>
        <div className="pt-4">
          <Link to="/">
            <Button className="w-full">Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-zinc-500 text-sm">Không có sản phẩm nào để thanh toán.</p>
        <Link to="/products">
          <Button>Quay lại mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/cart" 
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-emerald-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại giỏ hàng
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8">
        Thanh toán đơn hàng
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Addresses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-600" />
                Địa chỉ nhận hàng
              </h2>
              <Link to="/account" className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
                <Plus size={16} /> Thêm địa chỉ mới
              </Link>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-zinc-500 text-sm mb-4">Bạn chưa có địa chỉ giao hàng nào.</p>
                <Link to="/account">
                  <Button variant="outline">Thêm địa chỉ ngay</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label 
                    key={addr.id} 
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-200'}`}
                  >
                    <input 
                      type="radio" 
                      name="address" 
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{addr.receiverName}</span>
                        <span className="text-zinc-300 dark:text-zinc-700">|</span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{addr.phone}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md ml-2">Mặc định</span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{addr.detail}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-500">{[addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 pb-3 border-b border-zinc-200 dark:border-zinc-800">Đơn hàng của bạn</h2>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.productName}</p>
                  <p className="text-xs text-zinc-500">Phân loại: {item.variantName}</p>
                  <p className="text-xs text-zinc-400">Số lượng: {item.quantity}</p>
                </div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.lineTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>Tạm tính</span>
              <span>{cart.totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span>Phí vận chuyển</span>
              <span className="text-emerald-600">Miễn phí</span>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between font-bold text-zinc-900 dark:text-zinc-50">
              <span>Tổng thanh toán</span>
              <span className="text-xl text-emerald-600 dark:text-emerald-400">
                {cart.totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || addresses.length === 0 || !selectedAddressId}
            className="w-full py-3 cursor-pointer"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
