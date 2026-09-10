import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { CategorySlug, Product } from '../types';

interface HeroBentoProps {
  featuredProducts?: Product[];
  onSelectCategory: (category: CategorySlug) => void;
  onExploreAll: () => void;
  onOpenAppointment: () => void;
  onSelectProduct?: (product: Product) => void;
  onFilterByColor?: (hex: string) => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({
  featuredProducts = [],
  onSelectCategory,
  onExploreAll,
  onOpenAppointment,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
      {/* 4-Card Bento Grid Layout Matching image.png */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        {/* BLOCK 1: Top-Left Large Showcase Hero (md:col-span-8) */}
        <div className="md:col-span-8 bg-[#EBF3EF] rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px] sm:min-h-[420px]">
          {/* Top Pill Tag */}
          <div className="relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/90 text-slate-700 text-[11px] font-bold shadow-xs">
              Designer Eyewear
            </span>
          </div>

          {/* Main Copy & Eyewear Visual */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-4">
            <div className="sm:col-span-7 space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Best Eyewear <br />
                Collection
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
                Precision prescription lenses and handcrafted titanium frames serve their purpose in total harmony of style.
              </p>
              <div className="pt-2">
                <button
                  onClick={onExploreAll}
                  className="px-6 py-2.5 sm:py-3 rounded-full bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Showcase Stage on right */}
            <div className="sm:col-span-5 relative flex items-center justify-center">
              {/* Soft arched backdrop like reference furniture/podium */}
              <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-white/80 border border-slate-200/60 shadow-inner flex items-center justify-center p-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"
                  alt="Best Eyewear Collection"
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
                {/* Floating clinical rating tag */}
                <div className="absolute -bottom-2 -left-2 bg-white px-3 py-1.5 rounded-full shadow-md text-[10px] font-bold text-slate-800 flex items-center gap-1 border border-slate-100">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>6/6 Tested</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Dots at bottom */}
          <div className="relative z-10 flex items-center gap-1.5 pt-2">
            <span
              onClick={() => setActiveSlide(0)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === 0 ? 'w-6 bg-[#111827]' : 'w-2 bg-slate-400'
              }`}
            />
            <span
              onClick={() => setActiveSlide(1)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === 1 ? 'w-6 bg-[#111827]' : 'w-2 bg-slate-400'
              }`}
            />
            <span
              onClick={() => setActiveSlide(2)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === 2 ? 'w-6 bg-[#111827]' : 'w-2 bg-slate-400'
              }`}
            />
          </div>
        </div>

        {/* BLOCK 2: Top-Right Peach Banner (md:col-span-4) */}
        <div className="md:col-span-4 bg-[#FDF1EC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wide">
              Supper Sale 50%
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1">
              Stylish Looks For Any Season
            </h3>
            <div className="mt-4">
              <button
                onClick={() => onSelectCategory('sunglasses')}
                className="px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Model with sunglasses */}
          <div className="absolute right-0 bottom-0 w-44 h-44 sm:w-48 sm:h-48 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
              alt="Stylish Looks"
              className="w-full h-full object-cover object-top mix-blend-multiply opacity-90"
            />
          </div>
        </div>

        {/* BLOCK 3: Bottom-Left Cream Banner (md:col-span-6) */}
        <div className="md:col-span-6 bg-[#FAF4E8] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden flex items-center justify-between min-h-[200px]">
          <div className="space-y-2 max-w-[240px] z-10">
            <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wide">
              Supper Sale 50%
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Stylish Men's Fashion
            </h3>
            <button
              onClick={() => onSelectCategory('eyeglasses')}
              className="mt-2 px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer inline-block"
            >
              Shop Now
            </button>
          </div>

          {/* Model in yellow sweater & eyewear */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0 relative">
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80"
              alt="Stylish Men's Eyewear"
              className="w-full h-full object-cover rounded-2xl mix-blend-multiply"
            />
          </div>
        </div>

        {/* BLOCK 4: Bottom-Right Pastel Blue Banner (md:col-span-6) */}
        <div className="md:col-span-6 bg-[#EAF3FB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden flex items-center justify-between min-h-[200px]">
          <div className="space-y-2 max-w-[240px] z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold tracking-wide">
              Mid Summer Sale 30% Off
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Blue-Cut Digital Eyewear
            </h3>
            <button
              onClick={() => onSelectCategory('computer-glasses')}
              className="mt-2 px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer inline-block"
            >
              Shop Now
            </button>
          </div>

          {/* Youth wearing smart frame */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0 relative">
            <img
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80"
              alt="Kids and Digital Eyewear"
              className="w-full h-full object-cover rounded-2xl mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
