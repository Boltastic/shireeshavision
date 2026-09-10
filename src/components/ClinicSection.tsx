import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  Award,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/initialData';

interface ClinicSectionProps {
  onOpenAppointment: () => void;
}

export const ClinicSection: React.FC<ClinicSectionProps> = ({ onOpenAppointment }) => {
  return (
    <section id="clinic-section" className="py-12 sm:py-16 bg-[#F4F6F8] border-y border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold tracking-wider uppercase">
            <Eye className="w-3.5 h-3.5 text-teal-700" />
            Computerised Eye Clinic
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {CLINIC_INFO.centerName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Advanced digital eye examinations, computerized refraction, contact lens fitting, and
            curated eyewear backed by certified optical practitioners.
          </p>
        </div>

        {/* Bento Grid: Storefront, Equipment, and Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Clinic Facilities & Computerized Testing (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
                  Diagnostic Technology
                </span>
                <span className="text-xs font-semibold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Zero Error 6/6 Accuracy
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Precision Computerized Refraction & Lens Alignment
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our clinic utilizes digital autorefractors to assess your exact focal power, astigmatic
                axis, and pupil distance in seconds. Whether you need single vision, progressive
                bifocals, or blue-cut computer shields, your glasses are fitted to surgical tolerance.
              </p>

              {/* Clinical Services Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CLINIC_INFO.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timings & Booking Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>Clinic Working Hours</span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  Mon – Sat: <strong className="text-slate-900">{CLINIC_INFO.timings.weekdays}</strong>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  Sunday: <strong className="text-slate-900">{CLINIC_INFO.timings.sunday}</strong>
                </div>
              </div>

              <button
                onClick={onOpenAppointment}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-teal-300" />
                <span>Book Clinic Eye Exam</span>
              </button>
            </div>
          </div>

          {/* Card 2: Clinic Location & Contact Details (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0B2A22] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-950 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold border border-white/10">
                <MapPin className="w-3.5 h-3.5" />
                Clinic Location
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                Visit Us at Our Center
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Address</span>
                    <p className="leading-relaxed text-slate-300">{CLINIC_INFO.address}</p>
                    <p className="text-slate-300 font-semibold">
                      {CLINIC_INFO.city}, {CLINIC_INFO.state} – {CLINIC_INFO.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Appointments & Help</span>
                    <a
                      href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`}
                      className="text-teal-300 hover:underline font-semibold"
                    >
                      {CLINIC_INFO.phone}
                    </a>{' '}
                    • {CLINIC_INFO.alternatePhone}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Email Support</span>
                    <a
                      href={`mailto:${CLINIC_INFO.email}`}
                      className="text-teal-300 hover:underline"
                    >
                      {CLINIC_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorised Brand Partners Tag */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold block">
                Authorized Optical Partners
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-200">
                {CLINIC_INFO.brandsCarried.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
