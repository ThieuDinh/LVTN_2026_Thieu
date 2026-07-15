import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Storefront,
  Check,
  Lock,
  LockOpen,
  PencilSimple,
  MagnifyingGlass,
  X,
  Warning,
} from '@phosphor-icons/react';
import { adminService } from '../../services/adminService';

const STATUS_FILTERS = ['', 'Pending', 'Active', 'Suspended'];

const statusBadge = (status) => {
  const map = {
    Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const labels = { Pending: 'Chờ duyệt', Active: 'Hoạt động', Suspended: 'Bị khoá' };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] ?? 'bg-gray-800 text-gray-400'}`}>
      {labels[status] ?? status}
    </span>
  );
};

// Modal chỉnh hoa hồng
function CommissionModal({ shop, onClose, onSaved }) {
  const [value, setValue] = useState((shop.commissionRate * 100).toFixed(1));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async () => {
    const rate = parseFloat(value) / 100;
    if (isNaN(rate) || rate < 0 || rate > 1) {
      setErr('Nhập giá trị từ 0 đến 100');
      return;
    }
    setLoading(true);
    try {
      const updated = await adminService.updateCommission(shop.id, rate);
      onSaved(updated);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white text-lg">Điều chỉnh hoa hồng</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300"><X size={20} /></button>
        </div>
        <p className="text-gray-400 text-sm mb-4">Gian hàng: <span className="text-white font-medium">{shop.name}</span></p>
        <label className="block text-sm text-gray-400 mb-1">Tỷ lệ hoa hồng (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
        />
        {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm transition-colors">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShopsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [commissionShop, setCommissionShop] = useState(null);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getShops(statusFilter);
      setShops(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  const handleApprove = async (shopId) => {
    setActionLoading(shopId + '_approve');
    try {
      const updated = await adminService.approveShop(shopId);
      setShops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleSuspend = async (shop) => {
    setActionLoading(shop.id + '_suspend');
    try {
      const updated = await adminService.toggleSuspendShop(shop.id);
      setShops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCommissionSaved = (updated) => {
    setShops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const filtered = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n ?? 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý gian hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Duyệt, khoá và điều chỉnh hoa hồng</p>
        </div>
      </div>

      {/* Filters & search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSearchParams(s ? { status: s } : {})}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {s || 'Tất cả'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên shop hoặc chủ..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm flex gap-2 items-center">
          <Warning size={16} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-left">
                <th className="px-5 py-3.5 font-medium">Gian hàng</th>
                <th className="px-5 py-3.5 font-medium">Chủ shop</th>
                <th className="px-5 py-3.5 font-medium">Tỉnh</th>
                <th className="px-5 py-3.5 font-medium text-center">Sp</th>
                <th className="px-5 py-3.5 font-medium text-center">Hoa hồng</th>
                <th className="px-5 py-3.5 font-medium text-center">Trạng thái</th>
                <th className="px-5 py-3.5 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <Storefront size={36} className="mx-auto mb-2 opacity-30" />
                    Không có gian hàng nào
                  </td>
                </tr>
              ) : (
                filtered.map((shop) => (
                  <tr key={shop.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {shop.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">{shop.name}</p>
                          <p className="text-xs text-gray-500">ID #{shop.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-300">{shop.ownerName}</p>
                      <p className="text-xs text-gray-500">{shop.ownerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{shop.province || '—'}</td>
                    <td className="px-5 py-4 text-center text-gray-300">{fmt(shop.totalProducts)}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-violet-400 font-semibold">
                        {(shop.commissionRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">{statusBadge(shop.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve */}
                        {shop.status === 'Pending' && (
                          <button
                            onClick={() => handleApprove(shop.id)}
                            disabled={actionLoading === shop.id + '_approve'}
                            title="Duyệt gian hàng"
                            className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition-colors disabled:opacity-50"
                          >
                            <Check size={16} weight="bold" />
                          </button>
                        )}
                        {/* Suspend / Unsuspend */}
                        {shop.status !== 'Pending' && (
                          <button
                            onClick={() => handleToggleSuspend(shop)}
                            disabled={actionLoading === shop.id + '_suspend'}
                            title={shop.status === 'Suspended' ? 'Mở khoá' : 'Khoá gian hàng'}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                              shop.status === 'Suspended'
                                ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40'
                                : 'bg-red-600/20 text-red-400 hover:bg-red-600/40'
                            }`}
                          >
                            {shop.status === 'Suspended' ? <LockOpen size={16} /> : <Lock size={16} />}
                          </button>
                        )}
                        {/* Commission */}
                        <button
                          onClick={() => setCommissionShop(shop)}
                          title="Điều chỉnh hoa hồng"
                          className="p-2 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/40 transition-colors"
                        >
                          <PencilSimple size={16} />
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

      {/* Commission Modal */}
      {commissionShop && (
        <CommissionModal
          shop={commissionShop}
          onClose={() => setCommissionShop(null)}
          onSaved={handleCommissionSaved}
        />
      )}
    </div>
  );
}
