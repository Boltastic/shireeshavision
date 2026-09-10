import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Banknote,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CartItem, Order, OrderCustomer } from '../types';
import { CLINIC_INFO } from '../data/initialData';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  cartItems?: CartItem[];
  appliedDiscount?: number;
  initialDiscount?: number;
  onOrderPlaced?: (order: Order) => void;
  onOrderSuccess?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items: directItems,
  cartItems,
  appliedDiscount = 0,
  initialDiscount = 0,
  onOrderPlaced,
  onOrderSuccess,
}) => {
  const items = directItems || cartItems || [];
  const discount = appliedDiscount || initialDiscount || 0;
  const notifyOrderPlaced = onOrderPlaced || onOrderSuccess || (() => {});

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi_card' | 'pay_at_clinic'>('upi_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close modal on Escape key press
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

  if (!isOpen || (items || []).length === 0) return null;

  const subtotal = (items || []).reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setErrorMsg('Please enter your full name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate swift payment / verification
    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // canvas-confetti fallback
      }

      const newOrder: Order = {
        id: `SH66-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString(),
        customer,
        items,
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'upi_card' ? 'Paid' : 'Pending at Delivery/Clinic',
        orderStatus: 'Confirmed',
        trackingNumber: `DEL-66-${Math.floor(100000 + Math.random() * 900000)}`,
        statusHistory: [
          {
            status: 'Pending',
            date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            note: 'Order submitted by customer online.',
          },
          {
            status: 'Confirmed',
            date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            note: 'Prescription & frame assigned at Shireesha 6/6 Vision Care Center.',
          },
        ],
      };

      setIsSubmitting(false);
      notifyOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
              Secure Checkout • Shireesha 6/6 Vision Care
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Customer Details Form (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Delivery & Contact Details
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+91 98490 00000"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Flat / House No., Apartment name, Street, Landmark"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      placeholder="500072"
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    2. Payment & Delivery Mode
                  </h3>

                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod('upi_card')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'upi_card'
                          ? 'border-teal-500 bg-teal-50/60 font-bold text-teal-950 ring-1 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-teal-600" />
                        <div>
                          <div>UPI / Google Pay / PhonePe / Card</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            Instant online payment with instant dispatch
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'upi_card'}
                        onChange={() => setPaymentMethod('upi_card')}
                        className="text-teal-600"
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-teal-500 bg-teal-50/60 font-bold text-teal-950 ring-1 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Cash on Delivery (COD)</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            Pay when your glasses arrive at your doorstep
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-teal-600"
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('pay_at_clinic')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'pay_at_clinic'
                          ? 'border-teal-500 bg-teal-50/60 font-bold text-teal-950 ring-1 ring-teal-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-700" />
                        <div>
                          <div>Pick Up & Pay at 6/6 Vision Care Center</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            Get free computerized fitting verification by doctor
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'pay_at_clinic'}
                        onChange={() => setPaymentMethod('pay_at_clinic')}
                        className="text-teal-600"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Column (5 Cols) */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Order Summary ({items.length} Items)
                </h3>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.cartItemId}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-800">{it.product.name}</span>
                        <div className="text-[11px] text-slate-500">
                          Qty: {it.quantity} • {it.selectedColor.name}
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Frame Alignment</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Place Order • ₹{total.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>

                <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Backed by Shireesha 6/6 Vision Care Clinic Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
