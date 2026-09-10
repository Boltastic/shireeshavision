import React from 'react';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  compact = false,
}) => {
  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges & Quick Action Icons */}
      <div className="relative w-full">
        {/* Top-left: Red Sale Tag */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-1 left-1 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white tracking-wide shadow-xs">
            Sale
          </span>
        )}

        {/* Top-right: Heart (Wishlist) & Quick View */}
        <div className="absolute top-1 right-1 z-10 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500'
                : 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-slate-100'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-7 h-7 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Quick view details"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Centered Product Image on clean white canvas */}
        <div className="w-full aspect-[4/3] rounded-xl bg-white overflow-hidden flex items-center justify-center relative p-2 my-2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      {/* Product Details matching reference */}
      <div className="pt-2 flex flex-col flex-1 justify-between">
        <div>
          {/* Product Title with fixed min-height for uniform card heights */}
          <h3 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-teal-900 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Clinical Calibration / Motion View Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-500 text-[11px]">6/6 Clinic Verified</span>
          </div>

          {/* Price Row: Bold Black Price + Gray Strike-through */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <span className="text-slate-400 font-medium">({product.reviewCount || 25})</span>
          </div>
        </div>

        {/* Add to Cart Pill Button (Matching Reference Card) */}
        <div className="mt-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className="w-full py-2 px-3 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
