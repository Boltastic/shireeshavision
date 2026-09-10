import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/initialData';
import { BrandLogo } from './BrandLogo';
import { CategorySlug } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategorySlug) => void;
  onOpenAppointment: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAppointment,
  onOpenOrderTracking,
  onOpenAdmin,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-[#08231C] text-white pt-12 pb-8 border-t border-emerald-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
        {/* 1. TOP 4 PERK PILLARS (Matching image.png footer features) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Free Fast Shipping</h5>
              <p className="text-xs text-slate-300">On all orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">24/7 Clinical Support</h5>
              <p className="text-xs text-slate-300">Optometrist advice & advice</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">100% Money Back</h5>
              <p className="text-xs text-slate-300">14-day hassle free returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">100% Secure Payment</h5>
              <p className="text-xs text-slate-300">UPI, Cards & Netbanking</p>
            </div>
          </div>
        </div>

        {/* 2. FOOTER MAIN COLUMNS (Matching image.png structure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Clinic Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Shireesha 6/6 Vision Care is a certified clinical eye care center in Hyderabad providing computerized refraction, pediatric eyewear, progressive lenses, and 100% genuine branded frames.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`} className="hover:text-amber-300">
                  {CLINIC_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="hover:text-amber-300">
                  {CLINIC_INFO.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Mon–Sat: {CLINIC_INFO.timings.weekdays} | Sun: {CLINIC_INFO.timings.sunday}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onSelectCategory('eyeglasses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Eyeglasses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('sunglasses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Sunglasses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('computer-glasses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Blue-Cut Glasses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('contact-lenses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Contact Lenses
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('kids')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Kids Eyewear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Browse All
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Services (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Quick Links & Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={onOpenAppointment} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Book Free Eye Test</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenOrderTracking} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Track Your Order
                </button>
              </li>
              <li>
                <a href="#clinic-section" className="hover:text-amber-300 transition-colors">
                  Doctor Profile & Clinic Info
                </a>
              </li>
              <li>
                <a href="#catalogue-section" className="hover:text-amber-300 transition-colors">
                  Weekly Best Deals
                </a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-slate-400">
                  <Lock className="w-3 h-3" />
                  <span>Store Administration</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Newsletter
            </h4>
            <p className="text-xs text-slate-300">
              Sign up for our newsletter and receive a flat 20% discount coupon for your next pair.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Coupon code <strong>VISION20</strong> has been applied to your session!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-3.5 pr-28 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-slate-400">
              We respect your privacy. No spam ever.
            </div>
          </div>
        </div>

        {/* 3. COPYRIGHT & PAYMENT BADGES */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Shireesha 6/6 Vision Care. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Secure Payments via:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-white/10">UPI</span>
              <span className="px-2 py-0.5 rounded bg-white/10">RuPay</span>
              <span className="px-2 py-0.5 rounded bg-white/10">Visa</span>
              <span className="px-2 py-0.5 rounded bg-white/10">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
