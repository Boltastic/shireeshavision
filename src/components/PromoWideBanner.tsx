import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CategorySlug } from '../types';

interface PromoWideBannerProps {
  onSelectCategory: (category: CategorySlug) => void;
  onOpenAppointment: () => void;
}

export const PromoWideBanner: React.FC<PromoWideBannerProps> = ({
  onSelectCategory,
  onOpenAppointment,
}) => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Emerald/Mint Green Wide Banner matching image.png */}
      <div className="bg-[#134E3F] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-emerald-800/40">
        {/* Left Visual: High-End Eyewear Showcase */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative">
          <div className="relative w-64 h-36 sm:w-80 sm:h-44 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
              alt="Shireesha Smart Eyewear"
              className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right Copy: Brand & Upgrade Callout */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-3">
          <span className="text-xs sm:text-sm font-black tracking-widest text-emerald-200 uppercase">
            SHIREESHA 6/6 VISION CARE
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-tight">
            UPGRADE YOUR WELLBEING WITH CLINICAL PRECISION & HD LENSES
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
            Computerized refraction, customized anti-glare coatings, and 100% genuine Ray-Ban and Acuvue lenses.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => onSelectCategory('sunglasses')}
              className="px-7 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0A2E24] font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              SHOP NOW
            </button>
            <button
              onClick={onOpenAppointment}
              className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-xs tracking-wider transition-all border border-white/30 cursor-pointer"
            >
              BOOK FREE EYE TEST
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
