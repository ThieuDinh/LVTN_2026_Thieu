import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Star, MapPin, ArrowRight } from '@phosphor-icons/react';

export const ShopList = ({ shops = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <div 
          key={shop.id}
          className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800/80 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
          {/* Shop Banner */}
          <div className="h-32 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
            <img 
              src={shop.banner} 
              alt={shop.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Shop Avatar & Details Container */}
          <div className="relative px-5 pb-5 pt-12 flex-grow flex flex-col justify-between">
            {/* Avatar overlaying the banner */}
            <div className="absolute -top-10 left-5 w-16 h-16 rounded-2xl border-2 border-white dark:border-zinc-900 overflow-hidden shadow-md bg-white">
              <img 
                src={shop.avatar} 
                alt={`${shop.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 transition-colors">
                  {shop.name}
                </h3>
                <Badge variant="warning" className="flex items-center gap-1">
                  <Star weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                  {shop.rating}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>{shop.location}</span>
              </div>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {shop.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <Link 
                to={`/shop/${shop.id}`}
                className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                Ghé gian hàng
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
