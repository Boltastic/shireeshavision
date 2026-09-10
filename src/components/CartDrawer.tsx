import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  cartItems?: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedDiscount?: number) => void;
  onOpenAppointment?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items: directItems,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenAppointment,
}) => {
  const items = directItems || cartItems || [];
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Close drawer on Escape key press
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

  const subtotal = (items || []).reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );
  const total = Math.max(0, subtotal - appliedDiscount);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'VISION66' || code === '66CARE') {
      const discountVal = Math.min(300, Math.round(subtotal * 0.15));
      setAppliedDiscount(discountVal);
      setCouponMsg({ text: `Coupon applied! Saved ₹${discountVal}`, isError: false });
    } else if (code) {
      setCouponMsg({ text: 'Invalid code. Try "VISION66" for clinic discount', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-teal-600" />
            <h2 className="font-extrabold text-base text-slate-900">Your Eyewear Cart</h2>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
              {(items || []).reduce((sum, i) => sum + (i.quantity || 1), 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Items Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Find your perfect frame with computer blue-light protection or sunglasses!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#0A2E24] text-white text-xs font-bold hover:bg-[#061e17] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Browse Eyewear
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-[#FAFCFD] flex gap-3 relative group"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span>•</span>
                      <span>{item.selectedSize}</span>
                    </div>

                    <div className="mt-1 inline-block text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
                      {item.lensOption === 'zero_power'
                        ? 'Zero Power / Blue Cut'
                        : item.lensOption === 'anti_glare_bluecut'
                        ? 'Anti-Glare Blue-Cut Prescription'
                        : item.lensOption === 'frame_only'
                        ? 'Frame Only'
                        : 'Single Vision Rx'}
                    </div>
                  </div>

                  {/* Quantity & Item Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-xs sm:text-sm text-[#24103B]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Coupon Code Box */}
          {items.length > 0 && (
            <div className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder='Coupon code (Try "VISION66")'
                    className="w-full text-xs py-2 pl-8 pr-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none uppercase"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponMsg && (
                <div
                  className={`text-[11px] mt-1.5 font-medium ${
                    couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {couponMsg.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout Row */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-[#F9FAFB] space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Clinical Lens Inspection</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(appliedDiscount)}
              className="w-full py-3.5 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>1-Year Warranty & Lifetime Clinic Frame Adjustment</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
