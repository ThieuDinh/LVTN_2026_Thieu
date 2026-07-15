// Order Service
// Connects to Backend API (NongSan.API)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api';

export const orderService = {
  createOrder: async (orderData, token) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const storedToken = localStorage.getItem('nongsan_token');
        if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đặt hàng thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  getOrderHistory: async (status = '') => {
    try {
      const token = localStorage.getItem('nongsan_token');
      if (!token) throw new Error('Yêu cầu đăng nhập');
      
      const url = status ? `${API_BASE_URL}/orders/my-orders?status=${status}` : `${API_BASE_URL}/orders/my-orders`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Không thể tải lịch sử đơn hàng');
      return result.data;
    } catch (error) {
      console.error('Get order history error:', error);
      throw error;
    }
  },

  cancelOrder: async (shopOrderId, reason) => {
    const token = localStorage.getItem('nongsan_token');
    const response = await fetch(`${API_BASE_URL}/orders/shop-orders/${shopOrderId}/cancel`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message);
    return result.data;
  },

  confirmDelivered: async (shopOrderId) => {
    const token = localStorage.getItem('nongsan_token');
    const response = await fetch(`${API_BASE_URL}/orders/shop-orders/${shopOrderId}/confirm-delivered`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message);
    return result.data;
  }
};
