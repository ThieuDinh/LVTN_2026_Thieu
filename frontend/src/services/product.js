// Product & Shop Service
// Connects to Backend API (NongSan.API)

const API_BASE_URL = 'http://localhost:5000/api';

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/products?${query}`);
      if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm');
      return await response.json();
    } catch (error) {
      console.error('Get products error, loading mock fallbacks:', error);
      // Fallback mock data for visual development
      return [
        { id: 1, name: 'Sầu riêng Ri6 Tây Nam Bộ', price: 120000, unit: 'kg', image: 'https://picsum.photos/seed/durian/400/300', rating: 4.8, shop: 'Nông Sản Miền Tây', description: 'Sầu riêng Ri6 thơm ngon béo ngậy, cơm vàng hạt lép.' },
        { id: 2, name: 'Bơ sáp Đắk Lắk thượng hạng', price: 55000, unit: 'kg', image: 'https://picsum.photos/seed/avocado/400/300', rating: 4.6, shop: 'Gia Vị Tây Nguyên', description: 'Bơ sáp dẻo ngon, thích hợp làm sinh tố hoặc salad.' },
        { id: 3, name: 'Cam sành Hàm Yên organic', price: 35000, unit: 'kg', image: 'https://picsum.photos/seed/orange/400/300', rating: 4.5, shop: 'Nông Sản Hữu Cơ', description: 'Cam sành ngọt nước, giàu vitamin C.' },
        { id: 4, name: 'Bưởi da xanh Bến Tre', price: 65000, unit: 'quả', image: 'https://picsum.photos/seed/pomelo/400/300', rating: 4.9, shop: 'Nông Sản Miền Tây', description: 'Bưởi da xanh tép hồng ngọt thanh, mọng nước.' },
        { id: 5, name: 'Xoài cát Hòa Lộc ngon ngọt', price: 80000, unit: 'kg', image: 'https://picsum.photos/seed/mango/400/300', rating: 4.7, shop: 'Hợp Tác Xã Sông Hậu', description: 'Xoài cát Hòa Lộc thơm nức tiếng, ngọt đậm đà.' },
        { id: 6, name: 'Măng cụt Chợ Lách', price: 75000, unit: 'kg', image: 'https://picsum.photos/seed/mangosteen/400/300', rating: 4.8, shop: 'Hợp Tác Xã Sông Hậu', description: 'Măng cụt tươi giòn, ngọt dịu tự nhiên.' }
      ];
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Không thể tải chi tiết sản phẩm');
      return await response.json();
    } catch (error) {
      console.error('Get product by ID error, loading mock fallback:', error);
      return {
        id: Number(id),
        name: 'Nông Sản Hữu Cơ Cao Cấp',
        price: 120000,
        unit: 'kg',
        description: 'Sản phẩm nông sản sạch được trồng trọt hoàn toàn theo phương pháp tự nhiên, không sử dụng thuốc trừ sâu hóa học hay chất bảo quản, đạt tiêu chuẩn VietGAP.',
        image: 'https://picsum.photos/seed/detail/800/600',
        rating: 4.9,
        reviewsCount: 120,
        shop: {
          id: 1,
          name: 'Nông Sản Miền Tây',
          rating: 4.8,
          location: 'Cần Thơ',
          avatar: 'https://picsum.photos/seed/storeavatar/100/100'
        }
      };
    }
  },

  getShops: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shops`);
      if (!response.ok) throw new Error('Không thể tải danh sách gian hàng');
      return await response.json();
    } catch (error) {
      console.error('Get shops error, loading mock fallbacks:', error);
      return [
        { id: 1, name: 'Nông Sản Miền Tây', rating: 4.8, location: 'Cần Thơ', avatar: 'https://picsum.photos/seed/shop1/150/150', banner: 'https://picsum.photos/seed/banner1/800/300', description: 'Chuyên cung cấp trái cây đặc sản miền Tây chất lượng cao.' },
        { id: 2, name: 'Gia Vị Tây Nguyên', rating: 4.6, location: 'Đắk Lắk', avatar: 'https://picsum.photos/seed/shop2/150/150', banner: 'https://picsum.photos/seed/banner2/800/300', description: 'Các loại hạt tiêu, cà phê, ca cao và gia vị núi rừng.' },
        { id: 3, name: 'Nông Sản Hữu Cơ', rating: 4.9, location: 'Đà Lạt', avatar: 'https://picsum.photos/seed/shop3/150/150', banner: 'https://picsum.photos/seed/banner3/800/300', description: 'Rau củ quả tươi sạch hữu cơ từ Đà Lạt.' }
      ];
    }
  },

  getShopById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shops/${id}`);
      if (!response.ok) throw new Error('Không thể tải chi tiết gian hàng');
      return await response.json();
    } catch (error) {
      console.error('Get shop by ID error, loading mock fallback:', error);
      return {
        id: Number(id),
        name: id === 2 ? 'Gia Vị Tây Nguyên' : id === 3 ? 'Nông Sản Hữu Cơ' : 'Nông Sản Miền Tây',
        rating: 4.8,
        location: id === 2 ? 'Đắk Lắk' : id === 3 ? 'Đà Lạt' : 'Cần Thơ',
        avatar: `https://picsum.photos/seed/shop${id}/150/150`,
        banner: `https://picsum.photos/seed/banner${id}/1200/400`,
        description: 'Gian hàng uy tín cung cấp các mặt hàng nông sản Việt đạt chuẩn an toàn vệ sinh thực phẩm cao nhất.',
        followers: 1250,
        productsCount: 45
      };
    }
  }
};
