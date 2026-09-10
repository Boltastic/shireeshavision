import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { storage } from '../services/storage';
import { CLINIC_INFO } from '../data/initialData';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    return initialOrderId ? storage.getOrderById(initialOrderId) || null : null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    const result = storage.getOrderById(searchInput.trim());
    setSearchedOrder(result || null);
    setHasSearched(true);
  };

  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return steps.indexOf(status);
  };

  const currentStepIdx = searchedOrder ? getStepIndex(searchedOrder.orderStatus) : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden my-auto p-5 sm:p-8 space-y-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Track Eyewear Order
            </h2>
            <p className="text-xs text-slate-500">
              Live updates on lens cutting, computerized inspection & dispatch
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g. SH66-94821) or Tracking No."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0A2E24] hover:bg-[#061e17] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Search Result Body */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {searchedOrder ? (
            <div className="space-y-6">
              {/* Order Meta Header */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900">
                      {searchedOrder.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        searchedOrder.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : searchedOrder.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {searchedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Customer: {searchedOrder.customer.fullName} • Tracking:{' '}
                    {searchedOrder.trackingNumber}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">TOTAL AMOUNT</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{searchedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 5-Step Visual Timeline */}
              {searchedOrder.orderStatus !== 'Cancelled' ? (
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    {/* Line behind steps */}
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-teal-500 -z-0 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, (currentStepIdx / 4) * 100))}%`,
                      }}
                    />

                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div
                          key={step}
                          className="relative z-10 flex flex-col items-center text-center"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCompleted
                                ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                                : 'bg-white border-2 border-slate-300 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                              isCurrent
                                ? 'text-teal-900'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  This order was marked as Cancelled. Please reach out to the clinic for details.
                </div>
              )}

              {/* Status History Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Clinical Progress & Shipping Logs
                </h4>
                <div className="space-y-2">
                  {searchedOrder.statusHistory?.map((hist, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5"
                    >
                      <Clock className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{hist.status}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {hist.date}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{hist.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordered Items Summary */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ordered Products
                </h4>
                <div className="space-y-2">
                  {searchedOrder.items.map((it) => (
                    <div
                      key={it.cartItemId}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{it.product.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Color: {it.selectedColor.name} • Size: {it.selectedSize}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">
                        ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinic Support Help */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Questions about your prescription?</div>
                  <div className="text-slate-500 text-[11px]">
                    Call Optometrist desk directly at {CLINIC_INFO.phone}
                  </div>
                </div>
                <a
                  href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-1.5 rounded-full bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Clinic
                </a>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No order found with that ID</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Double-check the Order ID (e.g. SH66-94821) from your receipt or confirmation.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Orders
                </span>
                <span className="text-[11px] text-slate-500">
                  Click any order to view live tracking & status
                </span>
              </div>

              {storage.getOrders().length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {storage.getOrders().map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSearchInput(ord.id);
                        setSearchedOrder(ord);
                        setHasSearched(true);
                      }}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-xs">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {ord.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {ord.items.length} item(s) • {ord.customer.fullName} •{' '}
                            {new Date(ord.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-xs text-slate-900">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-teal-600 font-bold hover:underline">
                          View details &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 text-slate-400">
                  <Package className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs">
                    Enter your order ID above to view live lens cutting and delivery progress.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
