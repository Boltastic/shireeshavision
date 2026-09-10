import React from 'react';
import { Category, CategorySlug } from '../types';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: CategorySlug;
  onSelectCategory: (category: CategorySlug) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-4 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#24103B] tracking-tight">
            Shop By Category
          </h2>
          <p className="text-xs text-slate-500">
            Certified lenses fitted with computerized clinic precision
          </p>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className={`text-xs font-bold transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'text-teal-700 underline underline-offset-4'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          View All Frames ({(categories || []).reduce((sum, c) => sum + (c?.itemCount || 0), 0)})
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories
          .filter((c) => c.isActive)
          .map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative rounded-2xl p-3 sm:p-4 border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-teal-50/90 to-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
                }`}
              >
                {cat.badge && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
                    {cat.badge}
                  </span>
                )}

                <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      isSelected ? 'text-teal-900' : 'text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {cat.itemCount} Designs In Stock
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
