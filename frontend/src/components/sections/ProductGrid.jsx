import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Star, ShoppingCart } from '@phosphor-icons/react';

export const ProductGrid = ({ products = [] }) => {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product.id}
          className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800/80 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
          {/* Product Image */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="primary" className="backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 flex items-center gap-1">
                <Star weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                {product.rating}
              </Badge>
            </div>
          </div>

          {/* Product Content */}
          <div className="p-5 flex flex-col flex-grow justify-between">
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                {product.shop}
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 hover:text-emerald-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-5 mt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-xs text-zinc-400 font-normal ml-0.5">
                  /{product.unit}
                </span>
              </div>

              <Button 
                onClick={() => addToCart(product)}
                size="sm" 
                className="flex items-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                Thêm
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
