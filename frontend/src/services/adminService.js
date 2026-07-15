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
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Lỗi không xác định');
  }
  return data.data;
};

export const adminService = {
  // ── Stats ──────────────────────────────────────
  getStats: () =>
    fetch(`${API_URL}/admin/stats`, { headers: getAuthHeaders() }).then(handleResponse),

  // ── Shops ──────────────────────────────────────
  getShops: (status = '') =>
    fetch(`${API_URL}/admin/shops${status ? `?status=${status}` : ''}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  approveShop: (id) =>
    fetch(`${API_URL}/admin/shops/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  toggleSuspendShop: (id) =>
    fetch(`${API_URL}/admin/shops/${id}/toggle-suspend`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateCommission: (id, commissionRate) =>
    fetch(`${API_URL}/admin/shops/${id}/commission`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ commissionRate }),
    }).then(handleResponse),

  // ── Users ──────────────────────────────────────
  getUsers: (role = '') =>
    fetch(`${API_URL}/admin/users${role ? `?role=${role}` : ''}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  lockUser: (id) =>
    fetch(`${API_URL}/admin/users/${id}/lock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  unlockUser: (id) =>
    fetch(`${API_URL}/admin/users/${id}/unlock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then(handleResponse),
};
