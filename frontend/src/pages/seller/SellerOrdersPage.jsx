import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  MagnifyingGlass, 
  Eye, 
  Check, 
  Truck, 
  X, 
  Warning 
} from '@phosphor-icons/react';
import { sellerOrderService } from '../../services/sellerOrderService';

const statusMap = {
  Pending: { label: 'Chờ xác nhận', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  Confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  Shipping: { label: 'Đang giao', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  Delivered: { label: 'Đã giao', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Cancelled: { label: 'Đã huỷ', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

// Modal chi tiết đơn hàng
function OrderDetailModal({ orderId, onClose, onUpdated }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    sellerOrderService.getOrderDetail(orderId)
      .then(setDetail)
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleConfirm = async () => {
    if (!window.confirm('Xác nhận đơn hàng này?')) return;
    setActionLoading(true);
    try {
      await sellerOrderService.confirmOrder(orderId);
      onUpdated();
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = async () => {
    if (!trackingCode.trim()) return alert("Vui lòng nhập mã vận đơn");
    setActionLoading(true);
    try {
      await sellerOrderService.shipOrder(orderId, trackingCode);
      onUpdated();
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return alert("Vui lòng nhập lý do huỷ");
    setActionLoading(true);
    try {
      await sellerOrderService.cancelOrder(orderId, cancelReason);
      onUpdated();
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl">Đang tải...</div>
    </div>
  );

  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-white rounded-2xl border border-[#D1DDD4] w-full max-w-3xl mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1DDD4]">
          <h3 className="font-bold text-lg text-[#1A2E1F]">Chi tiết đơn hàng #{detail.id}</h3>
          <button onClick={onClose} className="text-[#6B7F70] hover:text-[#1A2E1F]">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Thông tin chung */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#6B7F70] mb-1">Khách hàng</p>
              <p className="font-medium text-[#1A2E1F]">{detail.buyerName}</p>
              <p className="text-[#1A2E1F]">{detail.buyerPhone}</p>
            </div>
            <div>
              <p className="text-[#6B7F70] mb-1">Trạng thái</p>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusMap[detail.status]?.cls}`}>
                {statusMap[detail.status]?.label}
              </span>
            </div>
            <div className="col-span-2">
              <p className="text-[#6B7F70] mb-1">Giao đến</p>
              <p className="font-medium text-[#1A2E1F]">{detail.shipReceiverName} - {detail.shipPhone}</p>
              <p className="text-[#1A2E1F]">{detail.shipAddress}</p>
            </div>
          </div>

          {/* Sản phẩm */}
          <div>
            <h4 className="font-bold text-[#1A2E1F] mb-3">Sản phẩm</h4>
            <div className="space-y-3">
              {detail.items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-[#F0F7F2] p-3 rounded-xl border border-[#D1DDD4]">
                  <div>
                    <p className="font-medium text-[#1A2E1F]">{item.snapshotName}</p>
                    <p className="text-xs text-[#6B7F70]">SKU: {item.snapshotSKU}</p>
                    <p className="text-sm mt-1">SL: <span className="font-semibold">{item.quantity}</span> x {fmtPrice(item.snapshotPrice)}</p>
                  </div>
                  <span className="font-bold text-[#5A8A6A]">{fmtPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="border-t border-[#D1DDD4] pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7F70]">Tạm tính</span>
              <span className="font-medium">{fmtPrice(detail.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7F70]">Phí vận chuyển</span>
              <span className="font-medium">{fmtPrice(detail.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#1A2E1F] pt-2 border-t border-[#D1DDD4]">
              <span>Tổng cộng</span>
              <span className="text-[#5A8A6A]">{fmtPrice(detail.total)}</span>
            </div>
          </div>

          {/* Hành động */}
          {detail.status === 'Pending' && !showCancel && (
            <div className="flex gap-3 pt-4 border-t border-[#D1DDD4]">
              <button onClick={() => setShowCancel(true)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors">
                Từ chối / Huỷ
              </button>
              <button onClick={handleConfirm} disabled={actionLoading} className="flex-1 py-2.5 bg-[#5A8A6A] text-white rounded-xl font-medium hover:bg-[#4a7257] transition-colors disabled:opacity-50">
                Xác nhận đơn
              </button>
            </div>
          )}

          {detail.status === 'Confirmed' && !showCancel && (
            <div className="pt-4 border-t border-[#D1DDD4] space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Mã vận đơn (Bắt buộc để giao hàng)</label>
                <input 
                  value={trackingCode} 
                  onChange={e => setTrackingCode(e.target.value)} 
                  className="w-full bg-white border border-[#D1DDD4] rounded-lg px-3 py-2 outline-none focus:border-[#5A8A6A]"
                  placeholder="VD: SPX0123456789"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCancel(true)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors">
                  Huỷ đơn
                </button>
                <button onClick={handleShip} disabled={actionLoading} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  Bàn giao vận chuyển
                </button>
              </div>
            </div>
          )}

          {showCancel && (
            <div className="pt-4 border-t border-[#D1DDD4] space-y-3 bg-red-50 p-4 rounded-xl mt-4">
              <h4 className="font-bold text-red-700">Lý do huỷ đơn</h4>
              <textarea 
                value={cancelReason} 
                onChange={e => setCancelReason(e.target.value)}
                rows={3}
                className="w-full border border-red-200 rounded-lg px-3 py-2 outline-none focus:border-red-400"
                placeholder="Nhập lý do huỷ..."
              />
              <div className="flex gap-3">
                <button onClick={() => setShowCancel(false)} className="flex-1 py-2 border border-[#D1DDD4] bg-white rounded-lg font-medium hover:bg-gray-50">
                  Quay lại
                </button>
                <button onClick={handleCancel} disabled={actionLoading} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50">
                  Xác nhận huỷ
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sellerOrderService.getOrders(statusFilter);
      setOrders(res.items || []); // PagedResult
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter(o => 
    o.id.toString().includes(search) || 
    o.buyerName.toLowerCase().includes(search.toLowerCase()) || 
    o.shipPhone.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2E1F]">Quản lý đơn hàng</h1>
          <p className="text-[#6B7F70] text-sm mt-1">Xác nhận, giao hàng và theo dõi đơn hàng</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 bg-white border border-[#D1DDD4] rounded-xl p-1 overflow-x-auto">
          {['', 'Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === s ? 'bg-[#5A8A6A] text-white' : 'text-[#6B7F70] hover:text-[#1A2E1F]'
              }`}
            >
              {s === '' ? 'Tất cả' : statusMap[s]?.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9EAFA3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên KH, SĐT..."
            className="w-full bg-white border border-[#D1DDD4] rounded-xl pl-9 pr-4 py-2 text-sm text-[#1A2E1F] placeholder-[#9EAFA3] focus:outline-none focus:border-[#5A8A6A]"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex gap-2 items-center">
          <Warning size={16} /> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D1DDD4] text-[#6B7F70] text-left bg-[#F0F7F2]/50">
                <th className="px-5 py-3.5 font-medium">Mã ĐH</th>
                <th className="px-5 py-3.5 font-medium">Ngày đặt</th>
                <th className="px-5 py-3.5 font-medium">Khách hàng</th>
                <th className="px-5 py-3.5 font-medium text-center">SL</th>
                <th className="px-5 py-3.5 font-medium text-right">Tổng tiền</th>
                <th className="px-5 py-3.5 font-medium text-center">Trạng thái</th>
                <th className="px-5 py-3.5 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#D1DDD4]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-[#F0F7F2] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[#9EAFA3]">
                    <ShoppingCart size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-medium">Chưa có đơn hàng nào</p>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-[#D1DDD4] last:border-0 hover:bg-[#F0F7F2]/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#1A2E1F]">#{o.id}</td>
                    <td className="px-5 py-4 text-[#6B7F70]">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1A2E1F]">{o.buyerName}</p>
                      <p className="text-xs text-[#9EAFA3]">{o.shipPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-center text-[#6B7F70]">{o.totalItems}</td>
                    <td className="px-5 py-4 text-right font-semibold text-[#5A8A6A]">{fmtPrice(o.total)}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusMap[o.status]?.cls}`}>
                        {statusMap[o.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(o.id)}
                          className="px-3 py-1.5 bg-[#F0F7F2] text-[#5A8A6A] border border-[#A8D5B5] rounded-lg hover:bg-[#A8D5B5] hover:text-[#1A2E1F] transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <Eye size={14} /> Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal 
          orderId={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onUpdated={fetchOrders} 
        />
      )}
    </div>
  );
}
