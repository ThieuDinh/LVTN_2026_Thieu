const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api';

export const shopService = {
  createShop: async (shopData) => {
    const token = localStorage.getItem('nongsan_token');
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập trước khi đăng ký gian hàng');
    }

    try {
      const response = await fetch(`${API_URL}/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errorMessage || 'Lỗi khi tạo gian hàng');
      }
      
      return data.data;
    } catch (error) {
      console.error('Create shop error:', error);
      throw error;
    }
  },

  getMyShop: async () => {
    const token = localStorage.getItem('nongsan_token');
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/shops/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return null;
      }
      return data.data;
    } catch {
      return null;
    }
  }
};
