// Authentication Service
// Communicates with backend authentication endpoints using environment configuration

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      if (result.success && result.data) {
        localStorage.setItem('nongsan_token', result.data.token);
        localStorage.setItem('nongsan_user', JSON.stringify(result.data));

        const role = result.data.role;
        if (role === 'Seller') {
          window.location.href = '/seller/dashboard';
        } else if (role === 'Admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/';
        }
      }
      return result;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async (fullName, email, password, phone) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, phone }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Đăng ký thất bại');
      }

      // Redirect to login with status parameter
      window.location.href = '/login?message=' + encodeURIComponent('Đăng ký thành công, vui lòng đăng nhập');
      return result;
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('nongsan_token');
    localStorage.removeItem('nongsan_user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('nongsan_user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('nongsan_token');
  }
};
