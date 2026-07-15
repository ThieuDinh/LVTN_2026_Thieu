const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('nongsan_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || 'Lỗi không xác định');
  return data.data;
};

const getShopId = () => {
  const userStr = localStorage.getItem('nongsan_user');
  if (!userStr) throw new Error("Chưa đăng nhập");
  const user = JSON.parse(userStr);
  if (!user.shopId) throw new Error("Bạn chưa có gian hàng");
  return user.shopId;
};

export const sellerOrderService = {
  // --- Orders ---
  getOrders: (status = '', page = 1, pageSize = 20) => {
    const shopId = getShopId();
    const qStatus = status ? `&status=${status}` : '';
    return fetch(`${API_URL}/orders/seller/shops/${shopId}?page=${page}&pageSize=${pageSize}${qStatus}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  getOrderDetail: (shopOrderId) =>
    fetch(`${API_URL}/orders/seller/shop-orders/${shopOrderId}`, { headers: getAuthHeaders() }).then(handleResponse),

  confirmOrder: (shopOrderId) =>
    fetch(`${API_URL}/orders/seller/shop-orders/${shopOrderId}/confirm`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  shipOrder: (shopOrderId, trackingCode) =>
    fetch(`${API_URL}/orders/seller/shop-orders/${shopOrderId}/ship`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ trackingCode }),
    }).then(handleResponse),

  cancelOrder: (shopOrderId, reason) =>
    fetch(`${API_URL}/orders/seller/shop-orders/${shopOrderId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    }).then(handleResponse),

  // --- Import Orders ---
  getImports: () =>
    fetch(`${API_URL}/importorders`, { headers: getAuthHeaders() }).then(handleResponse),

  createImport: (data) =>
    fetch(`${API_URL}/importorders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  confirmImport: (id) =>
    fetch(`${API_URL}/importorders/${id}/confirm`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};
