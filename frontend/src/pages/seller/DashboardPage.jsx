import React, { useState, useEffect } from 'react';
import { 
  CurrencyCircleDollar, 
  Receipt, 
  Package, 
  Star,
  TrendUp,
  CaretRight
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { shopService } from '../../services/shopService';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch these stats from the backend
    // For now, we simulate fetching stats after 500ms
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          revenue: 12500000,
          orders: 45,
          products: 12,
          rating: 4.8
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const statCards = [
    { 
      title: 'Doanh thu tháng này', 
      value: formatPrice(stats.revenue), 
      icon: <CurrencyCircleDollar size={32} weight="fill" />, 
      color: 'from-emerald-400 to-emerald-600',
      trend: '+12.5%'
    },
    { 
      title: 'Đơn hàng mới', 
      value: stats.orders, 
      icon: <Receipt size={32} weight="fill" />, 
      color: 'from-blue-400 to-blue-600',
      trend: '+5.2%'
    },
    { 
      title: 'Sản phẩm đang bán', 
      value: stats.products, 
      icon: <Package size={32} weight="fill" />, 
      color: 'from-amber-400 to-amber-600',
      trend: '0%'
    },
    { 
      title: 'Đánh giá trung bình', 
      value: `${stats.rating} / 5.0`, 
      icon: <Star size={32} weight="fill" />, 
      color: 'from-purple-400 to-purple-600',
      trend: '+0.1'
    }
  ];

  const recentOrders = [
    { id: 'ORD-2026-001', customer: 'Nguyễn Văn A', total: 450000, status: 'Chờ xác nhận', date: '22/06/2026' },
    { id: 'ORD-2026-002', customer: 'Trần Thị B', total: 1250000, status: 'Đang giao', date: '21/06/2026' },
    { id: 'ORD-2026-003', customer: 'Lê Hoàng C', total: 890000, status: 'Hoàn thành', date: '20/06/2026' },
    { id: 'ORD-2026-004', customer: 'Phạm Văn D', total: 320000, status: 'Đã hủy', date: '19/06/2026' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Chờ xác nhận': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đang giao': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2E1F]">Tổng quan gian hàng</h1>
        <p className="text-[#6B7F70] mt-1">Theo dõi hoạt động kinh doanh của bạn hôm nay</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-[#D1DDD4] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-inner`}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                <TrendUp size={12} weight="bold" />
                {card.trend}
              </div>
            </div>
            <div className="relative z-10">
              {loading ? (
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-1"></div>
              ) : (
                <h3 className="text-2xl font-bold text-[#1A2E1F] mb-1">{card.value}</h3>
              )}
              <p className="text-sm text-[#6B7F70] font-medium">{card.title}</p>
            </div>
            {/* Decorative background element */}
            <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500`}>
              {React.cloneElement(card.icon, { size: 120 })}
            </div>
          </div>
        ))}
      </div>

      {/* Two columns layout for tables/charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D1DDD4] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#D1DDD4] flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#1A2E1F]">Đơn hàng gần đây</h2>
            <Link to="/seller/orders" className="text-sm font-semibold text-[#5A8A6A] hover:text-[#4a7257] flex items-center gap-1">
              Xem tất cả <CaretRight size={14} weight="bold" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0F7F2] text-[#6B7F70] text-sm">
                  <th className="px-6 py-4 font-medium">Mã đơn</th>
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Ngày đặt</th>
                  <th className="px-6 py-4 font-medium text-right">Tổng tiền</th>
                  <th className="px-6 py-4 font-medium text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order, idx) => (
                  <tr key={order.id} className="border-b border-[#D1DDD4] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1A2E1F]">{order.id}</td>
                    <td className="px-6 py-4 text-[#6B7F70]">{order.customer}</td>
                    <td className="px-6 py-4 text-[#6B7F70]">{order.date}</td>
                    <td className="px-6 py-4 font-semibold text-[#1A2E1F] text-right">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products or Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#D1DDD4] shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-[#1A2E1F] mb-6">Sản phẩm bán chạy</h2>
          <div className="space-y-4 flex-1">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-[#D1DDD4] hover:bg-gray-50 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-[#F0F7F2] flex items-center justify-center text-xl shrink-0">
                  {item === 1 ? '🍓' : item === 2 ? '☕' : '🍯'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#1A2E1F] text-sm truncate">
                    {item === 1 ? 'Mứt dâu tây Đà Lạt' : item === 2 ? 'Cà phê Arabica Cầu Đất' : 'Mật ong hoa cà phê'}
                  </h4>
                  <p className="text-xs text-[#6B7F70] mt-0.5">{item === 1 ? '120.000 đ' : item === 2 ? '199.000 đ' : '250.000 đ'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#5A8A6A] text-sm">{145 - item * 20} đã bán</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/seller/products" className="mt-6 w-full py-2.5 rounded-xl border border-[#5A8A6A] text-[#5A8A6A] font-semibold text-center hover:bg-[#5A8A6A] hover:text-white transition-colors text-sm">
            Quản lý sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
