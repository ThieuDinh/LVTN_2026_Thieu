const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const productService = {
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể lấy thông tin sản phẩm');
      }
      return data.data;
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      throw error;
    }
  },

  getShopById: async (shopId) => {
    try {
      const response = await fetch(`${API_URL}/shops/${shopId}`);
      if (!response.ok) {
        throw new Error('Lỗi lấy thông tin shop');
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Lỗi lấy shop:", error);
      throw error;
    }
  }
};
