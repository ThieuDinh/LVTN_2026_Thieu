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

export const cartService = {
  getCart: () =>
    fetch(`${API_URL}/carts`, { headers: getAuthHeaders() }).then(handleResponse),

  addItem: (variantId, quantity = 1) =>
    fetch(`${API_URL}/carts/items`, {
      method: 'POST', headers: getAuthHeaders(),
      body: JSON.stringify({ variantId, quantity }),
    }).then(handleResponse),

  updateItem: (cartItemId, quantity) =>
    fetch(`${API_URL}/carts/items/${cartItemId}`, {
      method: 'PUT', headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    }).then(handleResponse),

  removeItem: (cartItemId) =>
    fetch(`${API_URL}/carts/items/${cartItemId}`, {
      method: 'DELETE', headers: getAuthHeaders(),
    }).then(handleResponse),

  clearCart: () =>
    fetch(`${API_URL}/carts`, {
      method: 'DELETE', headers: getAuthHeaders(),
    }).then(handleResponse),
};
