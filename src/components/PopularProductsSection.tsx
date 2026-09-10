import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface PopularProductsSectionProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const PopularProductsSection: React.FC<PopularProductsSectionProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  const [displayCount, setDisplayCount] = useState(10);

  const displayedProducts = products.slice(0, displayCount);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Popular Products
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Precision optical care and daily frames for total harmony of vision.
        </p>
      </div>

      {/* 5-Column Grid Matching image.png */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlist.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
            onSelectProduct={onSelectProduct}
            onQuickAddToCart={onQuickAddToCart}
          />
        ))}
      </div>

      {/* Load More Pill Button (image.png) */}
      {products.length > displayCount && (
        <div className="text-center mt-10">
          <button
            onClick={() => setDisplayCount((prev) => prev + 5)}
            className="px-8 py-2.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};
