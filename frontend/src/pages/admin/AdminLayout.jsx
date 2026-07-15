import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  SquaresFour,
  Storefront,
  Users,
  SignOut,
  Bell,
  List,
  X,
} from '@phosphor-icons/react';

const navItems = [
  {
    label: 'Tổng quan',
    path: '/admin/dashboard',
    icon: SquaresFour,
  },
  {
    label: 'Gian hàng',
    path: '/admin/shops',
    icon: Storefront,
  },
  {
    label: 'Người dùng',
    path: '/admin/users',
    icon: Users,
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('nongsan_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'Admin') {
      navigate('/');
      return;
    }
    setAdminName(user.fullName || 'Admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nongsan_token');
    localStorage.removeItem('nongsan_user');
    window.location.href = '/login';
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        } transition-all duration-300 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow">
            <ShieldCheck size={18} weight="fill" className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                <Icon size={20} weight={active ? 'fill' : 'regular'} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User / logout */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-100 truncate">{adminName}</p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <SignOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <List size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <span className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
