import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Lock,
  LockOpen,
  MagnifyingGlass,
  Warning,
  Storefront,
} from '@phosphor-icons/react';
import { adminService } from '../../services/adminService';

const ROLE_FILTERS = ['', 'Buyer', 'Seller', 'Admin'];

const roleBadge = (role) => {
  const map = {
    Admin: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    Seller: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    Buyer: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[role] ?? 'bg-gray-800 text-gray-400'}`}>
      {role}
    </span>
  );
};

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFilter = searchParams.get('role') || '';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers(roleFilter);
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleLock = async (userId) => {
    if (!window.confirm('Xác nhận khoá tài khoản này?')) return;
    setActionLoading(userId);
    try {
      const updated = await adminService.lockUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlock = async (userId) => {
    setActionLoading(userId);
    try {
      const updated = await adminService.unlockUser(userId);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
        <p className="text-gray-500 text-sm mt-1">Xem và khoá tài khoản vi phạm</p>
      </div>

      {/* Filters & search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setSearchParams(r ? { role: r } : {})}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {r || 'Tất cả'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email hoặc SĐT..."
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
                <th className="px-5 py-3.5 font-medium">Người dùng</th>
                <th className="px-5 py-3.5 font-medium">Số điện thoại</th>
                <th className="px-5 py-3.5 font-medium">Gian hàng</th>
                <th className="px-5 py-3.5 font-medium text-center">Vai trò</th>
                <th className="px-5 py-3.5 font-medium text-center">Trạng thái</th>
                <th className="px-5 py-3.5 font-medium">Ngày tạo</th>
                <th className="px-5 py-3.5 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
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
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    Không tìm thấy người dùng
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${user.isActive ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-gray-700'}`}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-medium ${user.isActive ? 'text-gray-100' : 'text-gray-500 line-through'}`}>
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{user.phone || '—'}</td>
                    <td className="px-5 py-4">
                      {user.shopName ? (
                        <div className="flex items-center gap-1.5 text-teal-400">
                          <Storefront size={14} />
                          <span className="text-sm">{user.shopName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">{roleBadge(user.role)}</td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          user.isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border-red-500/30'
                        }`}
                      >
                        {user.isActive ? 'Hoạt động' : 'Bị khoá'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{fmtDate(user.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      {user.role !== 'Admin' ? (
                        user.isActive ? (
                          <button
                            onClick={() => handleLock(user.id)}
                            disabled={actionLoading === user.id}
                            title="Khoá tài khoản"
                            className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors disabled:opacity-50"
                          >
                            <Lock size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnlock(user.id)}
                            disabled={actionLoading === user.id}
                            title="Mở khoá tài khoản"
                            className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition-colors disabled:opacity-50"
                          >
                            <LockOpen size={16} />
                          </button>
                        )
                      ) : (
                        <span className="text-gray-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-500">
            Hiển thị {filtered.length} / {users.length} người dùng
          </div>
        )}
      </div>
    </div>
  );
}
