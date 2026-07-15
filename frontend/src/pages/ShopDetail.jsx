import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/product';
import { ProductGrid } from '../components/sections/ProductGrid';
import { Badge } from '../components/ui/Badge';
import { Star, MapPin, Users, ShoppingBag } from '@phosphor-icons/react';

export const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const shopData = await productService.getShopById(id);
        const allProducts = await productService.getProducts();
        const shopProducts = allProducts.filter((p) => p.shop === shopData.name);
        setShop(shopData);
        setProducts(shopProducts);
      } catch (error) {
        console.error('Error fetching shop detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900"></div>
        <div className="h-20 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-zinc-100 dark:bg-zinc-900"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Không tìm thấy gian hàng.</p>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-12">
      {/* Shop Header & Banner */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img 
            src={shop.banner} 
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 md:-mt-24 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-zinc-950 overflow-hidden shadow-lg bg-white">
                <img 
                  src={shop.avatar} 
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left space-y-2 md:pb-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {shop.name}
                  </h1>
                  <Badge variant="warning" className="flex items-center gap-1">
                    <Star weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                    {shop.rating}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-300 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {shop.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-zinc-400" />
                    {shop.followers} người theo dõi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 max-w-3xl">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Giới thiệu</h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{shop.description}</p>
        </div>
      </div>

      {/* Shop Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
          Sản phẩm của gian hàng ({products.length})
        </h2>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">Gian hàng chưa có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
