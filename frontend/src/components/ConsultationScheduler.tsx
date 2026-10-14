import React, { useState, useEffect } from 'react';
import {
  Video, Phone, MessageSquare, Calendar, Clock, User, Mail, ChevronRight,
  CheckCircle2, Star, Shield, Award, AlertCircle, Sparkles, X
} from 'lucide-react';
import { fetchAdvisors, bookConsultation } from '../services/api';
import { AdvisorProfile, ConsultationBookingResponse } from '../types';

interface ConsultationSchedulerProps {
  defaultGap?: number;
  defaultCategory?: string;
}

const MODE_OPTIONS = [
  { id: 'video', label: 'Video Call', icon: Video, color: 'emerald' },
  { id: 'audio', label: 'Audio Call', icon: Phone, color: 'blue' },
  { id: 'chat', label: 'Live Chat', icon: MessageSquare, color: 'purple' },
];

export const ConsultationScheduler: React.FC<ConsultationSchedulerProps> = ({
  defaultGap,
  defaultCategory = 'term',
}) => {
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorProfile | null>(null);
  const [mode, setMode] = useState('video');
  const [date, setDate] = useState('2026-11-15');
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConsultationBookingResponse | null>(null);

  useEffect(() => {
    fetchAdvisors()
      .then(data => {
        setAdvisors(data);
        if (data.length > 0) {
          setSelectedAdvisor(data[0]);
          setSlot(data[0].available_slots[0] || '');
        }
      })
      .catch(() => setError('Failed to load advisors'));
  }, []);

  const handleBook = async () => {
    if (!selectedAdvisor || !name || !email || !phone || !slot) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await bookConsultation({
        advisor_id: selectedAdvisor.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        booking_date: date,
        time_slot: slot,
        consultation_mode: mode,
        notes_or_concerns: notes,
        recommended_product_category: defaultCategory,
        calculated_cover_gap: defaultGap,
      });
      setConfirmed(res);
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setConfirmed(null); setName(''); setEmail(''); setPhone(''); setNotes(''); };

  return (
    <section id="advisory" className="py-24 section-navy relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5" />
            Digital Advisory & Consultation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Book a 1-on-1 Session with a{' '}
            <span className="text-gradient-emerald">Certified Advisor</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base">
            Video, audio, or live chat — choose your preferred format and schedule instantly.
          </p>
        </div>

        {/* Confirmed Toast */}
        {confirmed && (
          <div className="fixed bottom-6 left-6 z-50 max-w-sm toast-enter">
            <div className="bg-white rounded-2xl shadow-2xl border border-emerald-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">Session Confirmed!</p>
                    <p className="text-xs text-slate-500">Ref: {confirmed.booking_reference}</p>
                  </div>
                </div>
                <button onClick={reset} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-slate-600">
                  <strong>Advisor:</strong> {confirmed.advisor_name} · {confirmed.consultation_mode}<br />
                  <strong>Scheduled:</strong> {confirmed.scheduled_datetime}
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-400">{confirmed.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── ADVISOR SELECTOR ── */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Choose Advisor</h3>
            {advisors.length === 0 && (
              <div className="finanza-card-dark p-4 rounded-xl text-slate-400 text-sm text-center">
                Loading advisors...
              </div>
            )}
            {advisors.map(adv => (
              <button
                key={adv.id}
                onClick={() => { setSelectedAdvisor(adv); setSlot(adv.available_slots[0] || ''); }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAdvisor?.id === adv.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'finanza-card-dark border-white/8 hover:border-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white shrink-0">
                    {adv.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{adv.name}</p>
                    <p className="text-slate-400 text-xs truncate">{adv.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-amber-300 text-xs font-bold">{adv.rating}</span>
                      <span className="text-slate-500 text-xs">· {adv.experience_years}Y exp</span>
                    </div>
                  </div>
                  {selectedAdvisor?.id === adv.id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-auto" />
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {adv.languages.slice(0, 2).map(lang => (
                    <span key={lang} className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-medium border border-white/8">
                      {lang}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-medium border border-white/8">
                    {adv.specialization}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ── BOOKING FORM ── */}
          <div className="lg:col-span-2">
            <div className="finanza-card-dark rounded-2xl p-6 border border-white/8">

              {/* Consultation Mode */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {MODE_OPTIONS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`py-3 rounded-xl flex flex-col items-center gap-1.5 text-sm font-semibold border transition-all cursor-pointer ${
                        mode === m.id
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-white/3 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <m.icon className="w-5 h-5" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min="2026-10-15"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Time Slot
                  </label>
                  <select
                    value={slot}
                    onChange={e => setSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all appearance-none cursor-pointer [color-scheme:dark]"
                  >
                    {selectedAdvisor?.available_slots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    <User className="w-3.5 h-3.5 inline mr-1" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Notes / Concerns
                </label>
                <textarea
                  rows={3}
                  placeholder="Any specific concerns or topics you'd like to discuss..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="book-session-btn"
                onClick={handleBook}
                disabled={loading}
                className="btn-emerald w-full py-4 text-base flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Confirming Session...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Confirm Advisory Session
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-slate-500">
                🔒 Demo consultation. No financial commitment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
