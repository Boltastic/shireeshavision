import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  Phone,
  ArrowRight,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { Order } from '../types';
import { CLINIC_INFO } from '../data/initialData';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-teal-50 border-4 border-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            Order Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#24103B] tracking-tight">
            Thank You, {order.customer.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your eyewear order has been received and registered at{' '}
            <strong className="text-slate-900">{CLINIC_INFO.name}</strong>.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold">ORDER ID</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold">TRACKING NO.</span>
            <span className="font-mono font-semibold text-teal-700">{order.trackingNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold">AMOUNT</span>
            <span className="font-bold text-[#24103B] text-sm">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold">STATUS</span>
            <span className="inline-block font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Delivery / Pickup Instructions */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-teal-700" />
            <span>Next Steps for Your Lenses</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            Our optometrists at 6/6 Vision Care Center will verify your lens parameters before final
            edge polishing. If you opted for clinic eye checkup, walk in anytime between 9:30 AM –
            8:30 PM with your Order ID.
          </p>
          <div className="text-[11px] text-teal-800 font-semibold flex items-center gap-1.5 pt-1">
            <Phone className="w-3.5 h-3.5" />
            <span>Need prompt assistance? Call Clinic directly at {CLINIC_INFO.phone}</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Items in this order
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {order.items.map((it) => (
              <div
                key={it.cartItemId}
                className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
              >
                <div>
                  <span className="font-bold text-slate-800">{it.product.name}</span>
                  <span className="text-slate-500 text-[11px] ml-2">
                    (Qty: {it.quantity} • {it.selectedColor.name})
                  </span>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="flex-1 py-3 px-5 rounded-full bg-[#1E2022] hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Package className="w-4 h-4 text-teal-300" />
            <span>Track Order Progress</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 px-5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
