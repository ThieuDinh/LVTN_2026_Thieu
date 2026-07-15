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

export const sellerProductService = {
  getMyProducts: () =>
    fetch(`${API_URL}/products/my-products`, { headers: getAuthHeaders() })
      .then(handleResponse),

  createProduct: (productData) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    }).then(handleResponse),

  updateProduct: (id, productData) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    }).then(handleResponse),

  deleteProduct: (id) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  toggleStatus: (id) =>
    fetch(`${API_URL}/products/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getCategories: () =>
    fetch(`${API_URL}/categories`, { headers: getAuthHeaders() })
      .then(handleResponse),
};
