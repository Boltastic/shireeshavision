import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Eye,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ClinicAppointment } from '../types';
import { storage } from '../services/storage';
import { CLINIC_INFO } from '../data/initialData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess?: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onBookSuccess,
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    serviceType: 'Computerised Eye Examination' as ClinicAppointment['serviceType'],
  });

  const [submittedApt, setSubmittedApt] = useState<ClinicAppointment | null>(null);

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

  const timeSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:30 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone) return;

    const newApt = storage.addAppointment(formData);
    setSubmittedApt(newApt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-lg font-black text-slate-900">Book Free Eye Test</h2>
              <p className="text-xs text-slate-500">
                At {CLINIC_INFO.centerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedApt ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 border-4 border-teal-100 text-teal-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-0.5 rounded-full">
                Appointment Reserved
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Slot Confirmed for {submittedApt.patientName}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your appointment ID is <strong>{submittedApt.id}</strong> on{' '}
                <strong>{submittedApt.date}</strong> at <strong>{submittedApt.timeSlot}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
              <div className="font-bold text-slate-800">Clinic Address:</div>
              <div className="text-slate-600">{CLINIC_INFO.address}</div>
              <div className="text-teal-700 font-semibold pt-1">
                Helpline: {CLINIC_INFO.phone}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#0A2E24] text-white font-bold text-xs hover:bg-[#061e17] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Patient Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98490 00000"
                    className="w-full p-2.5 pl-9 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Reason for Visit</label>
              <select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceType: e.target.value as ClinicAppointment['serviceType'],
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Computerised Eye Examination">
                  Computerised Eye Examination (Comprehensive)
                </option>
                <option value="Prescription & Power Check">Prescription & Power Verification</option>
                <option value="Contact Lens Trial & Fitting">Contact Lens Trial & Fitting</option>
                <option value="Children Vision Care">Pediatric Vision Care</option>
                <option value="Frame Styling Consultation">Frame Styling & Alignment</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white font-bold text-sm transition-all shadow-md mt-2 cursor-pointer active:scale-95"
            >
              Confirm Appointment Slot
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
