import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CustomerProfile,
  CalculationResult,
  AdvisorProfile,
  ConsultationBookingResponse
} from '../../types';
import { fetchAdvisors, bookConsultation, askAdvisoryAssistant } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import {
  Bot, Send, Sparkles, User, Video, Phone, Users, Calendar, Clock,
  CheckCircle2, ArrowLeft, Star, MessageSquare, AlertCircle, RefreshCw, X
} from 'lucide-react';

interface Stage4DigitalAdvisoryProps {
  profile: CustomerProfile;
  calculation: CalculationResult;
  selectedCategory: string;
  onBackToRecommender: () => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  relatedTopics?: string[];
}

export const Stage4DigitalAdvisory: React.FC<Stage4DigitalAdvisoryProps> = ({
  profile,
  calculation,
  selectedCategory,
  onBackToRecommender
}) => {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: `Hello! I am your **Insurance Mantra Advisory Specialist**. Based on your financial assessment, your estimated additional life cover requirement is **${formatINR(calculation.net_needs.net_additional_life_cover_required)}**.\n\nI can explain your mathematical breakdown, compare policy types, or prepare you with questions for your advisor. What would you like to explore?`,
      relatedTopics: [
        "Why do I need this much cover?",
        "What is the difference between total need and additional cover?",
        "Difference between Term and ULIP",
        "Top questions to ask my insurance advisor"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Booking state
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorProfile | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-11-15');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [consultationMode, setConsultationMode] = useState<string>('video');
  const [customerName, setCustomerName] = useState<string>('Srinivas Rao');
  const [customerEmail, setCustomerEmail] = useState<string>('srinivas.rao@example.com');
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [notes, setNotes] = useState<string>('Reviewing term protection tenure and critical illness rider.');

  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBookingResponse | null>(null);

  // Load advisors on mount
  useEffect(() => {
    fetchAdvisors()
      .then(data => {
        setAdvisors(data);
        if (data.length > 0) {
          setSelectedAdvisor(data[0]);
          setTimeSlot(data[0].available_slots[0] || '');
        }
      })
      .catch(err => console.error("Failed to load advisors:", err));
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Append user message
    const userMsg: ChatMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const response = await askAdvisoryAssistant({
        question: query,
        profile,
        calculation_result: calculation,
        selected_category: selectedCategory
      });

      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: response.answer,
        relatedTopics: response.related_topics
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: `Apologies, I encountered an error: ${err.message}. Please try again.` }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !timeSlot) {
      setBookingError("Please select an advisor and a preferred appointment slot.");
      return;
    }
    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await bookConsultation({
        advisor_id: selectedAdvisor.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: bookingDate,
        time_slot: timeSlot,
        consultation_mode: consultationMode,
        notes_or_concerns: notes,
        recommended_product_category: selectedCategory || 'term',
        calculated_cover_gap: calculation.net_needs.net_additional_life_cover_required
      });

      setConfirmedBooking(res);
      // Confetti burst for successful booking!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    } catch (err: any) {
      setBookingError(err.message || "Failed to schedule consultation slot.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Stage 4 of 4
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Digital Advisory Workspace & Consultation Scheduler
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ask our context-aware AI assistant questions about your exact figures, or book a simulated 1-on-1 advisor session.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Assessed Additional Cover</span>
            <span className="text-xl font-extrabold text-teal-600">
              {formatINR(calculation.net_needs.net_additional_life_cover_required)}
            </span>
          </div>
        </div>

        {/* Two-Column Grid: AI Assistant (Left) & Consultation Booking (Right) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: LifeWise AI Conversational Assistant */}
          <div className="lg:col-span-6 flex flex-col h-[650px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            
            {/* Assistant Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 p-[2px]">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-teal-300">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Insurance Mantra Advisor Assistant</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Synchronized with your Net Needs calculation</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Decision Support
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, lidx) => (
                        <p key={lidx} className={lidx > 0 ? 'mt-1.5' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Suggestion Pills */}
                  {msg.relatedTopics && msg.relatedTopics.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.relatedTopics.map((topic, tidx) => (
                        <button
                          key={tidx}
                          onClick={() => handleSendMessage(topic)}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors shadow-2xs cursor-pointer text-left"
                        >
                          ⚡ {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isAsking && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Consulting actuarial guidelines...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a question about your coverage or trade-offs..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isAsking || !inputQuery.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT: Advisor Consultation Booking Workflow */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Book 1-on-1 Advisor Consultation</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Schedule a simulated session to review your personalized Insurance Mantra report.
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Demo Scheduler
                </span>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              <form onSubmit={handleBookConsultation} className="space-y-4">
                
                {/* Advisor Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Specialist Advisor:
                  </label>
                  <div className="space-y-2">
                    {advisors.map(adv => {
                      const isChosen = selectedAdvisor?.id === adv.id;
                      return (
                        <div
                          key={adv.id}
                          onClick={() => {
                            setSelectedAdvisor(adv);
                            setTimeSlot(adv.available_slots[0] || '');
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChosen
                              ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-500'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={adv.image_url}
                              alt={adv.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-300"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{adv.name}</span>
                                <span className="flex items-center text-[10px] text-amber-600 font-bold">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                                  {adv.rating}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{adv.title}</p>
                              <p className="text-[10px] text-teal-700 font-medium">{adv.specialization}</p>
                            </div>
                          </div>

                          <div className="text-right text-[10px] text-slate-400">
                            {adv.experience_years} yrs exp
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Slot selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      {selectedAdvisor?.available_slots.map((slot, sidx) => (
                        <option key={sidx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Consultation Mode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'video', label: 'Video Call', icon: Video },
                      { id: 'phone', label: 'Phone Call', icon: Phone },
                      { id: 'in_person', label: 'In-Person', icon: Users }
                    ].map(mode => {
                      const Icon = mode.icon;
                      const isSel = consultationMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setConsultationMode(mode.id)}
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSel
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Specific Questions or Focus Areas</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Critical illness rider eligibility, claim settlement questions"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="confirm-booking-btn"
                  disabled={bookingLoading}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Reserving Appointment Slot in Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Advisor Appointment</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              All bookings are stored locally in the SQLite database and assigned a verifiable reference code.
            </div>
          </div>

        </div>
      </div>

      {/* CONFIRMED BOOKING MODAL */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setConfirmedBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed & Stored
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-3">
                Appointment Scheduled!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your consultation booking has been written to the Insurance Mantra database.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{confirmedBooking.booking_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Advisor:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.advisor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.scheduled_datetime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Mode:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.consultation_mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.customer_name}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-teal-800 bg-teal-50/50 p-2 rounded">
                <strong>Needs Summary:</strong> {confirmedBooking.summary_of_needs}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-3 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToRecommender}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Customizer</span>
        </button>

        <span className="text-xs text-slate-400">
          Stage 4 complete • Comprehensive 4-Stage Advisory Flow
        </span>
      </div>

    </div>
  );
};
