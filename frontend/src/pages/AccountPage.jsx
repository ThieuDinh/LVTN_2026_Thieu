import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, MapPin, Plus, PencilSimple, Trash, Star, FloppyDisk, X, Warning, Check, ShoppingCart, Storefront, Truck
} from '@phosphor-icons/react';
import { userService } from '../services/userService';
import { orderService } from '../services/order';

// ─── ADDRESS MODAL ────────────────────────────────────────────
function AddressModal({ address, onClose, onSaved }) {
  const isEdit = !!address;
  const [form, setForm] = useState({
    receiverName: address?.receiverName || '',
    phone: address?.phone || '',
    province: address?.province || '',
    district: address?.district || '',
    ward: address?.ward || '',
    detail: address?.detail || '',
    isDefault: address?.isDefault || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const inputCls = 'w-full bg-white border border-[#D1DDD4] rounded-lg px-3 py-2 text-sm text-[#1A2E1F] placeholder-[#9EAFA3] focus:outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.receiverName.trim() || !form.phone.trim() || !form.province.trim() || !form.detail.trim()) {
      return setError('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
    setLoading(true);
    try {
      const result = isEdit
        ? await userService.updateAddress(address.id, form)
        : await userService.createAddress(form);
      onSaved(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#D1DDD4] w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1DDD4]">
          <h3 className="font-bold text-lg text-[#1A2E1F]">{isEdit ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
          <button onClick={onClose} className="text-[#6B7F70] hover:text-[#1A2E1F]"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm flex gap-2 items-center"><Warning size={14} /> {error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7F70] mb-1">Người nhận *</label>
              <input value={form.receiverName} onChange={(e) => set('receiverName', e.target.value)} className={inputCls} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7F70] mb-1">Số điện thoại *</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="0901234567" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7F70] mb-1">Tỉnh/TP *</label>
              <input value={form.province} onChange={(e) => set('province', e.target.value)} className={inputCls} placeholder="TP.HCM" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7F70] mb-1">Quận/Huyện</label>
              <input value={form.district} onChange={(e) => set('district', e.target.value)} className={inputCls} placeholder="Quận 1" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7F70] mb-1">Phường/Xã</label>
              <input value={form.ward} onChange={(e) => set('ward', e.target.value)} className={inputCls} placeholder="Phường Bến Nghé" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7F70] mb-1">Địa chỉ chi tiết *</label>
            <input value={form.detail} onChange={(e) => set('detail', e.target.value)} className={inputCls} placeholder="Số 123, Đường ABC" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)}
              className="w-4 h-4 text-[#5A8A6A] rounded border-[#D1DDD4] focus:ring-[#5A8A6A]" />
            <span className="text-sm text-[#1A2E1F]">Đặt làm địa chỉ mặc định</span>
          </label>
        </form>
        <div className="flex gap-3 px-6 py-4 border-t border-[#D1DDD4]">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#D1DDD4] text-[#6B7F70] hover:bg-[#F0F7F2] text-sm font-medium transition-colors">Huỷ</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#5A8A6A] hover:bg-[#4a7257] text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <FloppyDisk size={16} /> {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT PAGE ─────────────────────────────────────────────
export default function AccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  // Profile
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', avatar: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [editAddr, setEditAddr] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('nongsan_token');
    if (!token) { navigate('/login'); return; }

    userService.getProfile().then((p) => {
      setProfile(p);
      setProfileForm({ fullName: p.fullName, phone: p.phone || '', avatar: p.avatar || '' });
    }).catch(() => navigate('/login'));

    userService.getAddresses().then(setAddresses).catch(() => {}).finally(() => setAddrLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (tab === 'orders') {
      setOrdersLoading(true);
      orderService.getOrderHistory(orderStatusFilter).then(res => {
        // Backend returns List<OrderResponse> which contains ShopOrders.
        // We will flatten it to show individual ShopOrders for easier tracking
        const allShopOrders = res.flatMap(order => order.shopOrders);
        setOrders(allShopOrders);
      }).catch(err => alert(err.message)).finally(() => setOrdersLoading(false));
    }
  }, [tab, orderStatusFilter]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const updated = await userService.updateProfile(profileForm);
      setProfile(updated);
      const stored = JSON.parse(localStorage.getItem('nongsan_user') || '{}');
      stored.fullName = updated.fullName;
      localStorage.setItem('nongsan_user', JSON.stringify(stored));
      window.dispatchEvent(new Event('storage'));
      setProfileMsg('Cập nhật thành công!');
    } catch (err) {
      setProfileMsg(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteAddr = async (id) => {
    if (!window.confirm('Xác nhận xoá địa chỉ?')) return;
    try {
      await userService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleAddrSaved = (saved) => {
    setAddresses((prev) => {
      const exists = prev.find((a) => a.id === saved.id);
      let list = exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
      if (saved.isDefault) list = list.map((a) => (a.id !== saved.id ? { ...a, isDefault: false } : a));
      return list;
    });
  };

  const handleCancelOrder = async (shopOrderId) => {
    const reason = prompt("Nhập lý do huỷ đơn hàng:");
    if (!reason) return;
    setActionLoading(true);
    try {
      await orderService.cancelOrder(shopOrderId, reason);
      setOrders(prev => prev.map(o => o.id === shopOrderId ? { ...o, status: 'Cancelled', cancelledReason: reason } : o));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelivered = async (shopOrderId) => {
    if (!window.confirm("Xác nhận bạn đã nhận được hàng?")) return;
    setActionLoading(true);
    try {
      await orderService.confirmDelivered(shopOrderId);
      setOrders(prev => prev.map(o => o.id === shopOrderId ? { ...o, status: 'Delivered' } : o));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const inputCls = 'w-full bg-white border border-[#D1DDD4] rounded-lg px-3 py-2.5 text-sm text-[#1A2E1F] placeholder-[#9EAFA3] focus:outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors';

  const orderStatusMap = {
    Pending: { label: 'Chờ xác nhận', cls: 'text-amber-600 bg-amber-50' },
    Confirmed: { label: 'Đang chuẩn bị', cls: 'text-blue-600 bg-blue-50' },
    Shipping: { label: 'Đang giao hàng', cls: 'text-indigo-600 bg-indigo-50' },
    Delivered: { label: 'Đã nhận hàng', cls: 'text-emerald-600 bg-emerald-50' },
    Cancelled: { label: 'Đã huỷ', cls: 'text-red-600 bg-red-50' },
  };
  const fmtPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-[#1A2E1F]">Tài khoản của tôi</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F0F7F2] border border-[#D1DDD4] rounded-xl p-1 w-fit">
        {[
          { key: 'profile', label: 'Hồ sơ', icon: <User size={16} /> }, 
          { key: 'addresses', label: 'Địa chỉ', icon: <MapPin size={16} /> },
          { key: 'orders', label: 'Đơn mua', icon: <ShoppingCart size={16} /> }
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-[#5A8A6A] text-white shadow-sm' : 'text-[#6B7F70] hover:text-[#1A2E1F]'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && profile && (
        <div className="bg-white rounded-2xl border border-[#D1DDD4] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b border-[#D1DDD4]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5A8A6A] to-[#A8D5B5] flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A2E1F]">{profile.fullName}</p>
              <p className="text-sm text-[#6B7F70]">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">Họ và tên</label>
              <input value={profileForm.fullName} onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">Số điện thoại</label>
              <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder="0901234567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">Avatar (URL)</label>
              <input value={profileForm.avatar} onChange={(e) => setProfileForm((p) => ({ ...p, avatar: e.target.value }))} className={inputCls} placeholder="https://..." />
            </div>
            {profileMsg && (
              <div className={`text-sm px-3 py-2 rounded-lg ${profileMsg.includes('thành công') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {profileMsg}
              </div>
            )}
            <button type="submit" disabled={profileLoading}
              className="px-6 py-2.5 bg-[#5A8A6A] hover:bg-[#4a7257] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
              <FloppyDisk size={16} /> {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}

      {/* Addresses tab */}
      {tab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#6B7F70]">Quản lý danh sách địa chỉ giao hàng</p>
            <button onClick={() => { setEditAddr(null); setShowAddrModal(true); }}
              className="px-4 py-2 bg-[#5A8A6A] hover:bg-[#4a7257] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <Plus size={16} /> Thêm địa chỉ
            </button>
          </div>

          {addrLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-24 bg-[#F0F7F2] rounded-2xl animate-pulse" />)}
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#D1DDD4] py-12 text-center text-[#9EAFA3]">
              <MapPin size={40} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium">Chưa có địa chỉ nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-colors ${addr.isDefault ? 'border-[#5A8A6A]' : 'border-[#D1DDD4]'}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1A2E1F]">{addr.receiverName}</span>
                        <span className="text-[#D1DDD4]">|</span>
                        <span className="text-sm text-[#6B7F70]">{addr.phone}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-[#5A8A6A]/10 text-[#5A8A6A] text-xs font-semibold rounded-full border border-[#5A8A6A]/20 flex items-center gap-1">
                            <Star size={10} weight="fill" /> Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7F70]">{addr.detail}</p>
                      <p className="text-sm text-[#9EAFA3]">{[addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => { setEditAddr(addr); setShowAddrModal(true); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><PencilSimple size={14} /></button>
                      <button onClick={() => handleDeleteAddr(addr.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['', 'Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setOrderStatusFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${orderStatusFilter === s ? 'bg-[#5A8A6A] text-white border-[#5A8A6A]' : 'bg-white text-[#6B7F70] border-[#D1DDD4] hover:bg-[#F0F7F2]'}`}>
                {s === '' ? 'Tất cả' : orderStatusMap[s].label}
              </button>
            ))}
          </div>

          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-40 bg-white border border-[#D1DDD4] rounded-2xl animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#D1DDD4] py-16 text-center text-[#9EAFA3]">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium text-[#6B7F70]">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="px-5 py-3 border-b border-[#D1DDD4] flex justify-between items-center bg-[#F0F7F2]/50">
                    <div className="flex items-center gap-2 text-[#1A2E1F] font-bold">
                      <Storefront size={18} className="text-[#5A8A6A]"/> {order.shopName}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${orderStatusMap[order.status]?.cls}`}>
                      {orderStatusMap[order.status]?.label}
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div className="p-5 space-y-4 border-b border-[#D1DDD4]">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#F0F7F2] rounded-xl flex items-center justify-center shrink-0">
                            {item.snapshotImage ? (
                              <img src={item.snapshotImage} alt={item.snapshotName} className="w-full h-full object-cover rounded-xl"/>
                            ) : (
                              <span className="text-[#A8D5B5] font-bold">IMG</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A2E1F]">{item.snapshotName}</p>
                            <p className="text-sm text-[#6B7F70]">Phân loại: {item.snapshotSKU}</p>
                            <p className="text-sm font-semibold text-[#1A2E1F]">x{item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-[#5A8A6A] font-bold">{fmtPrice(item.lineTotal)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-[#6B7F70]">
                      Thành tiền: <span className="text-xl font-bold text-[#C0392B] ml-1">{fmtPrice(order.total)}</span>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      {order.status === 'Pending' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={actionLoading}
                          className="flex-1 md:flex-none px-6 py-2 border border-[#D1DDD4] bg-white text-[#1A2E1F] font-medium rounded-xl hover:bg-gray-100 disabled:opacity-50">
                          Huỷ đơn
                        </button>
                      )}
                      {order.status === 'Shipping' && (
                        <button 
                          onClick={() => handleConfirmDelivered(order.id)}
                          disabled={actionLoading}
                          className="flex-1 md:flex-none px-6 py-2 bg-[#5A8A6A] text-white font-medium rounded-xl hover:bg-[#4a7257] disabled:opacity-50 flex items-center justify-center gap-2">
                          <Check size={18} weight="bold"/> Đã nhận được hàng
                        </button>
                      )}
                      {order.status === 'Shipping' && order.trackingCode && (
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl">
                          <Truck size={18}/> Vận đơn: {order.trackingCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddrModal && <AddressModal address={editAddr} onClose={() => setShowAddrModal(false)} onSaved={handleAddrSaved} />}
    </div>
  );
}
