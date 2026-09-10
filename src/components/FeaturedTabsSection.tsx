import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface FeaturedTabsSectionProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onExploreAll: () => void;
}

export const FeaturedTabsSection: React.FC<FeaturedTabsSectionProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onExploreAll,
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'offers'>('bestseller');

  // Filter products according to active tab
  let tabProducts = products;
  if (activeTab === 'new') {
    tabProducts = products.filter((p) => p.isNewArrival);
  } else if (activeTab === 'bestseller') {
    tabProducts = products.filter((p) => p.isBestSeller);
  } else {
    tabProducts = products.filter((p) => p.discountPercentage >= 30);
  }
  if (tabProducts.length < 8) {
    tabProducts = products;
  }
  const gridProducts = tabProducts.slice(0, 8);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Tabs: New Arrivals, Best Seller, Best Offers (Matching image.png) */}
      <div className="flex items-center justify-center gap-8 border-b border-slate-200/80 mb-8 pb-3">
        <button
          onClick={() => setActiveTab('new')}
          className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer ${
            activeTab === 'new'
              ? 'text-[#0A2E24] border-b-2 border-[#0A2E24]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          New Arrivals
        </button>

        <button
          onClick={() => setActiveTab('bestseller')}
          className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer ${
            activeTab === 'bestseller'
              ? 'text-[#0A2E24] border-b-2 border-[#0A2E24]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Best Seller
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer ${
            activeTab === 'offers'
              ? 'text-[#0A2E24] border-b-2 border-[#0A2E24]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Best Offers
        </button>
      </div>

      {/* Main Grid: Left Tall Card (25-30%) + Right Product Grid (70-75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Tall Dark Card Matching image.png */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#0B2A22] border border-emerald-950 text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
          {/* Top Countdown */}
          <div>
            <span className="text-[11px] text-emerald-300 font-medium block">
              Limited time only!
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded font-bold text-xs">20</span>
              <span className="font-bold text-emerald-400">:</span>
              <span className="px-2 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded font-bold text-xs">45</span>
              <span className="font-bold text-emerald-400">:</span>
              <span className="px-2 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded font-bold text-xs">09</span>
            </div>
          </div>

          {/* Featured Eyewear Visual in Center */}
          <div className="my-6 flex items-center justify-center relative">
            <div className="w-52 h-52 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80"
                alt="Vision Fest 2026"
                className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="space-y-2">
            <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Vision Fest 2026
            </h4>
            <p className="text-xs text-emerald-100/80">
              Up to 50% off premium prescription frames & polarized sunglasses.
            </p>
            <div className="pt-2">
              <button
                onClick={onExploreAll}
                className="w-full py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0A2E24] font-bold text-xs transition-colors cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Right 4x2 Grid of Product Cards */}
        <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
          {gridProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              isWishlisted={wishlist.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
