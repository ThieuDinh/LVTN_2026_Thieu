import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Storefront,
  Package,
  ShoppingCart,
  Clock,
  TrendUp,
  ArrowRight,
} from '@phosphor-icons/react';
import { adminService } from '../../services/adminService';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={24} weight="fill" className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 truncate">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n ?? 0);
  const fmtVnd = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-1 text-sm">Theo dõi dữ liệu toàn sàn theo thời gian thực</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Tổng người dùng" value={fmt(stats?.totalUsers)} color="bg-indigo-600" />
          <StatCard icon={Users} label="Người mua (Buyer)" value={fmt(stats?.totalBuyers)} color="bg-blue-600" />
          <StatCard icon={Users} label="Người bán (Seller)" value={fmt(stats?.totalSellers)} color="bg-teal-600" />
          <StatCard icon={Storefront} label="Gian hàng" value={fmt(stats?.totalShops)} color="bg-emerald-600"
            sub={stats?.pendingShops ? `${stats.pendingShops} chờ duyệt` : null} />
          <StatCard icon={Package} label="Sản phẩm" value={fmt(stats?.totalProducts)} color="bg-amber-600" />
          <StatCard icon={ShoppingCart} label="Đơn hàng" value={fmt(stats?.totalOrders)} color="bg-orange-600" />
          <StatCard icon={TrendUp} label="Hoa hồng nền tảng" value={fmtVnd(stats?.totalRevenue)} color="bg-violet-600" />
          <StatCard icon={Clock} label="Chờ duyệt" value={fmt(stats?.pendingShops)} color="bg-red-600"
            sub="gian hàng cần xét duyệt" />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Gian hàng chờ duyệt</h2>
            <Link
              to="/admin/shops?status=Pending"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <div className="text-center py-6">
            <p className="text-5xl font-bold text-amber-400">{fmt(stats?.pendingShops)}</p>
            <p className="text-gray-500 mt-2 text-sm">gian hàng đang chờ phê duyệt</p>
            <Link
              to="/admin/shops?status=Pending"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Storefront size={16} weight="fill" /> Duyệt ngay
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Điều hướng nhanh</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Quản lý tất cả gian hàng', path: '/admin/shops', icon: Storefront },
              { label: 'Xem danh sách người bán', path: '/admin/users?role=Seller', icon: Users },
              { label: 'Xem danh sách người mua', path: '/admin/users?role=Buyer', icon: Users },
            ].map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3 text-gray-300 group-hover:text-white">
                  <Icon size={18} />
                  <span className="text-sm">{label}</span>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
