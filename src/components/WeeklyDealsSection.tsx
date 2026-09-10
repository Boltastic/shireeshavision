import React, { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CategorySlug, Product } from '../types';

interface WeeklyDealsSectionProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onSelectCategory: (category: CategorySlug) => void;
}

export const WeeklyDealsSection: React.FC<WeeklyDealsSectionProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Almost Sold out');

  const dealTabs = [
    'Up to 50% off',
    'Under ₹999',
    'Almost Sold out',
    'Eyeglasses',
    'Sunglasses',
    'Blue-Light Glasses',
    'Contact Lenses',
    'Kids Eyewear',
  ];

  // Filter 5 featured deal products
  const dealProducts = products.slice(0, 5);

  return (
    <section id="weekly-deals-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Deep Forest Green Container Matching image.png */}
      <div className="bg-[#0B2A22] rounded-3xl p-5 sm:p-8 md:p-10 text-white shadow-md">
        {/* Header Row: Title on Left, Red Countdown on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Weekly Best Deals
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              Handpicked clinical frames and polarized shades at special weekly prices.
            </p>
          </div>

          {/* Countdown Clock Box with Red Digits */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-300 text-xs hidden md:inline">Limited time only!</span>
            <div className="flex items-center gap-1">
              <span className="w-8 h-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                02
              </span>
              <span className="font-bold text-white">:</span>
              <span className="w-8 h-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                35
              </span>
              <span className="font-bold text-white">:</span>
              <span className="w-8 h-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                40
              </span>
              <span className="font-bold text-white">:</span>
              <span className="w-8 h-8 rounded-lg bg-[#EF4444] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                40
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 py-5 overflow-x-auto no-scrollbar">
          {dealTabs.map((tab) => {
            const isActive = activeTab === tab;
            const isHighlight = tab === 'Almost Sold out';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isHighlight
                    ? 'bg-[#F59E0B] text-white shadow-xs hover:bg-[#D97706]'
                    : isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/10'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 5 Product Cards in a Row (Grid matching image.png) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 my-2">
          {dealProducts.map((prod) => (
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

        {/* 3 Bottom Promotional Banner Cards Matching image.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          {/* Promo Card 1 (Cyan/Light Blue) */}
          <div className="bg-[#EDF5F8] rounded-2xl p-5 text-slate-900 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                Screen Protection
              </span>
              <h4 className="text-base sm:text-lg font-bold leading-snug text-slate-900">
                Zero-Glare Blue-Cut <br /> Special Offer
              </h4>
              <button
                onClick={() => onSelectCategory('computer-glasses')}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#0E2B24] text-white text-xs font-semibold hover:bg-black transition-colors inline-block"
              >
                Shop Now
              </button>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80"
                alt="Blue-Cut Eyewear"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Promo Card 2 (Warm Peach/Beige) */}
          <div className="bg-[#FAF3EB] rounded-2xl p-5 text-slate-900 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Men's Collection
              </span>
              <h4 className="text-base sm:text-lg font-bold leading-snug text-slate-900">
                Titanium Aviators <br /> Starts from ₹999
              </h4>
              <button
                onClick={() => onSelectCategory('eyeglasses')}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#0E2B24] text-white text-xs font-semibold hover:bg-black transition-colors inline-block"
              >
                Shop Now
              </button>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80"
                alt="Titanium Aviators"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Promo Card 3 (Soft Mint) */}
          <div className="bg-[#EEF7F2] rounded-2xl p-5 text-slate-900 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Pediatric Vision
              </span>
              <h4 className="text-base sm:text-lg font-bold leading-snug text-slate-900">
                Kids Unbreakable <br /> Flex Frame Offer
              </h4>
              <button
                onClick={() => onSelectCategory('kids')}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#0E2B24] text-white text-xs font-semibold hover:bg-black transition-colors inline-block"
              >
                Shop Now
              </button>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=400&q=80"
                alt="Kids Eyewear"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
