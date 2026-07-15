import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Fetch shop gracefully
        try {
          const shopData = await productService.getShopById(data.shopId);
          setShop(shopData);
        } catch (shopErr) {
          console.warn("Could not load shop info", shopErr);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-[1200px] mx-auto px-[24px] py-[40px]">Đang tải...</div>;
  }
  
  if (error || !product) {
    return <div className="max-w-[1200px] mx-auto px-[24px] py-[40px]">Lỗi: {error || 'Không tìm thấy sản phẩm'}</div>;
  }

  const handleQuantityChange = (delta) => {
    if (!selectedVariant) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };
  const handleAction = async (actionType) => {
    const token = localStorage.getItem('nongsan_token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!selectedVariant || addingToCart) return;

    setAddingToCart(true);
    try {
      const { cartService } = await import('../services/cartService');
      await cartService.addItem(selectedVariant.id, quantity);
      window.dispatchEvent(new Event('cart-updated'));

      if (actionType === 'buy') {
        navigate('/cart');
      } else {
        alert('Đã thêm vào giỏ hàng');
      }
    } catch (err) {
      alert(err.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-[24px] py-[40px] flex flex-col gap-[40px]">
      {/* PHẦN 1 - Product Main */}
      <div className="flex flex-col md:flex-row gap-[40px]">
        {/* Cột Trái */}
        <div className="w-full md:w-[45%]">
          <div className="w-full aspect-square border border-[#D1DDD4] rounded-[12px] overflow-hidden flex items-center justify-center bg-[#F0F7F2]">
            {selectedVariant?.images || product.image ? (
              <img src={selectedVariant?.images || product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[120px]">🌿</span>
            )}
          </div>
        </div>
        
        {/* Cột Phải */}
        <div className="w-full md:w-[55%] flex flex-col">
          <div className="text-[12px] text-[#6B7F70] mb-2">
            Trang chủ / Danh mục / {product.name}
          </div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h1 className="text-[22px] font-semibold text-[#1A2E1F]">{product.name}</h1>
            {product.subscription && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                style={{
                  background: product.subscription.boostScore >= 100
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : 'linear-gradient(135deg, #5A8A6A, #3D7A5A)'
                }}
              >
                <span>{product.subscription.boostScore >= 100 ? '⭐' : '✨'}</span>
                {product.subscription.planName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#6B7F70] text-[13px] mb-4">
            <span>Đã bán: {product.totalSold || 0}</span>
            <span>|</span>
            <span>SKU: {selectedVariant?.sku || 'N/A'}</span>
          </div>
          
          <div className="text-[28px] font-bold text-[#5A8A6A] mb-6">
            {(selectedVariant?.price || product.basePrice || 0).toLocaleString('vi-VN')} ₫
          </div>
          
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-[#1A2E1F] font-medium">Phân loại:</span>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    setQuantity(1); // Reset quantity khi đổi variant
                  }}
                  className={`px-4 py-2 rounded-[8px] border transition-colors ${
                    selectedVariant?.id === v.id
                      ? 'bg-[#5A8A6A] text-white border-[#5A8A6A]'
                      : 'border-[#D1DDD4] text-[#1A2E1F] hover:border-[#A8D5B5]'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8 flex flex-col gap-2">
            <span className="text-[#1A2E1F] font-medium">Số lượng:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#D1DDD4] rounded-md overflow-hidden">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="px-3 py-1 bg-[#F0F7F2] hover:bg-[#D1DDD4] text-[#1A2E1F] transition-colors"
                >-</button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center outline-none text-[#1A2E1F]"
                />
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="px-3 py-1 bg-[#F0F7F2] hover:bg-[#D1DDD4] text-[#1A2E1F] transition-colors"
                >+</button>
              </div>
              <span className="text-[13px] text-[#6B7F70]">
                Còn lại: {selectedVariant?.stock || 0} {product.unit}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 mt-auto">
            <button 
              onClick={() => handleAction('cart')}
              disabled={addingToCart}
              className="flex-1 h-[44px] rounded-[8px] border border-[#5A8A6A] text-[#5A8A6A] font-medium hover:bg-[#5A8A6A] hover:text-white transition-colors disabled:opacity-50"
            >
              {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
            <button 
              onClick={() => handleAction('buy')}
              disabled={addingToCart}
              className="flex-1 h-[44px] rounded-[8px] bg-[#5A8A6A] text-white font-medium hover:bg-[#4a7257] transition-colors disabled:opacity-50"
            >
              {addingToCart ? 'Đang thêm...' : 'Mua ngay'}
            </button>
          </div>
        </div>
      </div>

      {/* PHẦN 2 - Shop Block */}
      <div className={`w-full p-[20px] rounded-[12px] flex items-center justify-between border ${product.subscription ? 'border-[#F59E0B]/30 bg-gradient-to-r from-[#FFFBEB] to-[#F0F7F2]' : 'border-[#D1DDD4] bg-[#F0F7F2]'}`}>
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-[#A8D5B5] flex items-center justify-center text-[#1A2E1F] font-bold text-xl overflow-hidden relative">
            {shop?.logo ? (
              <img src={shop.logo} alt="Shop avatar" className="w-full h-full object-cover" />
            ) : (
              (shop?.name || `Shop #${product.shopId}`).charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-[#1A2E1F] text-lg">
                {shop?.name || `Gian hàng #${product.shopId}`}
              </div>
              {product.subscription && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{
                    background: product.subscription.boostScore >= 100
                      ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                      : 'linear-gradient(135deg, #5A8A6A, #3D7A5A)'
                  }}
                >
                  {product.subscription.boostScore >= 100 ? '⭐' : '✨'} {product.subscription.planName}
                </span>
              )}
            </div>
            {product.subscription && (
              <p className="text-[11px] text-[#9EAFA3] mt-0.5">
                Gian hàng đã đăng ký gói {product.subscription.planName}
              </p>
            )}
          </div>
        </div>
        <Link 
          to={`/shops/${product.shopId}`}
          className="text-[#5A8A6A] border border-[#5A8A6A] px-4 py-2 rounded-md hover:bg-[#A8D5B5] hover:text-[#1A2E1F] transition-colors text-sm font-medium"
        >
          Xem gian hàng →
        </Link>
      </div>

      {/* PHẦN 3 - Mô tả & Chi tiết sản phẩm */}
      <div className="w-full border border-[#D1DDD4] rounded-[12px] overflow-hidden bg-white">
        <div className="flex border-b border-[#D1DDD4] bg-[#F0F7F2]">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'description' 
                ? 'border-b-2 border-[#5A8A6A] text-[#5A8A6A] bg-white' 
                : 'text-[#6B7F70] hover:text-[#1A2E1F]'
            }`}
          >
            Mô tả sản phẩm
          </button>
          <button
            onClick={() => setActiveTab('attributes')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'attributes' 
                ? 'border-b-2 border-[#5A8A6A] text-[#5A8A6A] bg-white' 
                : 'text-[#6B7F70] hover:text-[#1A2E1F]'
            }`}
          >
            Thông số chi tiết
          </button>
        </div>
        
        <div className="p-[24px]">
          {activeTab === 'description' ? (
            <div className="text-[#1A2E1F] leading-relaxed whitespace-pre-line">
              {product.description || 'Sản phẩm chưa có mô tả.'}
            </div>
          ) : (
            <div className="border border-[#D1DDD4] rounded-md overflow-hidden">
              {product.attributes && product.attributes.length > 0 ? (
                product.attributes.map((attr, index) => (
                  <div key={attr.id || index} className="grid grid-cols-3 border-b border-[#D1DDD4] last:border-b-0">
                    <div className="bg-[#F0F7F2] p-3 font-medium text-[#1A2E1F] col-span-1 border-r border-[#D1DDD4]">
                      {attr.attrName}
                    </div>
                    <div className="p-3 text-[#1A2E1F] col-span-2">
                      {attr.attrValue}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-[#6B7F70]">Chưa có thông số cho sản phẩm này.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PHẦN 4 - Đánh giá */}
      <div className="w-full">
        <h2 className="text-[20px] font-semibold text-[#1A2E1F] mb-6">ĐÁNH GIÁ SẢN PHẨM</h2>
        <div className="border border-[#D1DDD4] rounded-[12px] p-12 flex flex-col items-center justify-center bg-white">
          <span className="text-4xl mb-4">⭐</span>
          <p className="text-[#6B7F70] font-medium mb-1">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          <p className="text-[#6B7F70] text-sm">Tính năng đánh giá sẽ sớm ra mắt</p>
        </div>
      </div>
    </div>
  );
}
