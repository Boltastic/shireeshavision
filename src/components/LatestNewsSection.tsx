import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface LatestNewsSectionProps {
  onOpenAppointment: () => void;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ onOpenAppointment }) => {
  const articles = [
    {
      id: '1',
      title: 'How Blue-Cut Lenses Prevent Digital Eye Strain in Daily Screen Work',
      date: 'April 14, 2026',
      category: 'Clinical Care',
      author: 'Dr. Shireesha',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80',
      summary:
        'Modern LED displays emit high-energy blue wavelengths that cause headaches and dry eyes. Learn how coated filters protect your retinal health.',
    },
    {
      id: '2',
      title: 'Single Vision vs. Progressive Lenses: Which One Do You Actually Need?',
      date: 'April 10, 2026',
      category: 'Prescription Guide',
      author: 'Senior Optometrist',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80',
      summary:
        'Understanding how multi-focal channels eliminate the need for carrying two separate pairs of glasses everywhere you go.',
    },
    {
      id: '3',
      title: 'Why Computerized Refraction Tests Are Crucial Once Every 12 Months',
      date: 'April 04, 2026',
      category: 'Vision Health',
      author: 'Clinical Team',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      summary:
        'Early detection of astigmatism, glaucoma indicators, and corneal fatigue through modern German auto-refractometer technology.',
    },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Latest News & Guides
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Clinical optometrist insights on lens coatings, prescription accuracy, and ocular wellness.
        </p>
      </div>

      {/* 3 Articles Grid Matching image.png */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div>
              {/* Article Thumbnail */}
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            {/* Read More Link */}
            <div className="px-5 pb-5 pt-1">
              <button
                onClick={onOpenAppointment}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
