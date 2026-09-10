import React from 'react';
import { Smartphone, Download, PhoneCall, MessageSquare, Sparkles } from 'lucide-react';
import { CLINIC_INFO } from '../data/initialData';

interface AppDownloadBannerProps {
  onOpenAppointment: () => void;
}

export const AppDownloadBanner: React.FC<AppDownloadBannerProps> = ({ onOpenAppointment }) => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Dark Pine Green Container Matching image.png */}
      <div className="bg-[#0B2A22] rounded-3xl p-6 sm:p-10 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        {/* Left Side: Headline & Download Actions */}
        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Fast, Reliable & Direct
          </span>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            Shireesha 6/6 Vision Care <br />
            Easy App & Clinic Booking
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-md mx-auto md:mx-0">
            Book free computerized eye examinations, consult expert optometrists, and track your lens fitting in real-time.
          </p>

          {/* App Store & Clinic Direct Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={onOpenAppointment}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-[#0B2A22]" />
              <div className="text-left leading-tight">
                <span className="block text-[9px] text-slate-500 uppercase font-medium">Book In Clinic</span>
                <span className="font-bold">Free Eye Checkup</span>
              </div>
            </button>

            <a
              href={`https://wa.me/919849024680?text=${encodeURIComponent(
                'Hello Shireesha 6/6 Vision Care, I would like to book a free eye test or enquire about eyewear.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#20bd5a] transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <div className="text-left leading-tight">
                <span className="block text-[9px] text-emerald-100 uppercase font-medium">Chat On</span>
                <span className="font-bold">WhatsApp Direct</span>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Phone Mockups Graphic Matching image.png */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative">
          <div className="relative flex items-center justify-center">
            {/* Phone 1 (Back / Tilt) */}
            <div className="w-48 sm:w-56 bg-white rounded-3xl p-3 shadow-2xl border-4 border-slate-800 transform -rotate-6 hidden sm:block">
              <div className="bg-slate-50 rounded-2xl p-4 text-slate-800 space-y-3">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80"
                    alt="Prescription Frame"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="text-xs font-bold text-slate-900">Titanium AeroFlex 52mm</div>
                <div className="text-[11px] text-emerald-700 font-semibold">In-Stock • 6/6 Verified</div>
              </div>
            </div>

            {/* Phone 2 (Front / Hero) */}
            <div className="w-52 sm:w-60 bg-white rounded-3xl p-3 shadow-2xl border-4 border-slate-900 sm:-ml-12 z-10">
              <div className="bg-[#FAFDFB] rounded-2xl p-4 text-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Flat 20% Off
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">First Order</span>
                </div>

                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80"
                    alt="Doctor Checkup"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">Dr. Shireesha Optometrist</div>
                  <div className="text-[10px] text-slate-500">Computerized Examination Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
