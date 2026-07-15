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

export const userService = {
  getProfile: () =>
    fetch(`${API_URL}/users/me`, { headers: getAuthHeaders() }).then(handleResponse),

  updateProfile: (data) =>
    fetch(`${API_URL}/users/me`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
    }).then(handleResponse),

  getAddresses: () =>
    fetch(`${API_URL}/users/addresses`, { headers: getAuthHeaders() }).then(handleResponse),

  createAddress: (data) =>
    fetch(`${API_URL}/users/addresses`, {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
    }).then(handleResponse),

  updateAddress: (id, data) =>
    fetch(`${API_URL}/users/addresses/${id}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
    }).then(handleResponse),

  deleteAddress: (id) =>
    fetch(`${API_URL}/users/addresses/${id}`, {
      method: 'DELETE', headers: getAuthHeaders(),
    }).then(handleResponse),
};
