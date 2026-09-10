import React from 'react';
import { Category, CategorySlug } from '../types';

interface ShopByCategoryCirclesProps {
  categories: Category[];
  selectedCategory: CategorySlug;
  onSelectCategory: (slug: CategorySlug) => void;
  onOpenAppointment: () => void;
}

export const ShopByCategoryCircles: React.FC<ShopByCategoryCirclesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenAppointment,
}) => {
  const categoryItems = [
    {
      name: 'Eyeglasses',
      slug: 'eyeglasses' as CategorySlug,
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Sunglasses',
      slug: 'sunglasses' as CategorySlug,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Blue-Light Glasses',
      slug: 'computer-glasses' as CategorySlug,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Contact Lenses',
      slug: 'contact-lenses' as CategorySlug,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Kids Eyewear',
      slug: 'kids' as CategorySlug,
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Reading Glasses',
      slug: 'eyeglasses' as CategorySlug,
      image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Free Eye Test',
      slug: 'clinic' as any,
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=300&q=80',
      isClinic: true,
    },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
      <div className="max-w-xl mx-auto space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shop Deals by Category
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Precision optical care and daily frames for total harmony of vision.
        </p>
      </div>

      {/* Row of circular category cards matching image.png */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
        {categoryItems.map((item, idx) => {
          const isSelected = selectedCategory === item.slug;
          return (
            <div
              key={idx}
              onClick={() => {
                if (item.isClinic) {
                  onOpenAppointment();
                } else {
                  onSelectCategory(item.slug);
                  const catalogEl = document.getElementById('catalogue-section');
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circle Image Stage */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-2 flex items-center justify-center bg-[#F4F6F8] group-hover:bg-amber-50 border-2 transition-all duration-300 shadow-2xs ${
                  isSelected ? 'border-amber-500 bg-amber-50 scale-105' : 'border-transparent group-hover:border-amber-400'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Label */}
              <span className="mt-3 text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
