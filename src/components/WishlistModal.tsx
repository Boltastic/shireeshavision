import React, { useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-5 sm:p-8 space-y-5 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-black text-slate-900">Saved Wishlist</h2>
            <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              {wishlistedProducts.length} frames
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart on any frame to bookmark your favorite styles and compare later.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-[#FAFCFD] flex items-center justify-between gap-3 hover:shadow-xs transition-shadow"
              >
                <div
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-200"
                  />
                  <div className="truncate">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">
                      {prod.brand}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {prod.name}
                    </h4>
                    <span className="text-xs font-black text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      onQuickAddToCart(prod);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(prod.id)}
                    className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
