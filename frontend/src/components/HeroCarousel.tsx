import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Calculator, BookOpen, TrendingUp, Shield } from 'lucide-react';

interface HeroCarouselProps {
  onStartAssessment: () => void;
  onExploreProducts: () => void;
}

const SLIDES = [
  {
    id: 0,
    badge: 'AI Frontier Challenge 2026 — BFSI Track',
    headline: 'True Financial Protection Starts with Precise Calculation.',
    subtext: 'Ditch the guesswork. Use our Human Life Value engine to estimate your exact coverage needs in seconds — with zero hidden assumptions.',
    primaryCta: 'Start Assessment',
    secondaryCta: 'Explore Policy Types',
    accentColor: 'emerald',
    stat: { value: '₹500Cr+', label: 'Coverage Recommended' },
    bgGradient: 'from-[#0F172A] via-[#1E2D45] to-[#0F172A]',
    icon: Calculator,
  },
  {
    id: 1,
    badge: 'Net Needs Approach — Actuarially Validated',
    headline: 'Understand Exactly What Your Family Needs to Survive Without You.',
    subtext: 'Our Net Needs engine calculates your gross liability, deducts existing resources, and surfaces the true protection gap — transparently.',
    primaryCta: 'Calculate My Gap',
    secondaryCta: 'See Methodology',
    accentColor: 'gold',
    stat: { value: '50,000+', label: 'Lives Protected' },
    bgGradient: 'from-[#0F172A] via-[#1a2234] to-[#0F172A]',
    icon: Shield,
  },
  {
    id: 2,
    badge: 'Developed by Telugu Hackers',
    headline: 'Compare, Customize, and Book Your Life Cover — All in One Place.',
    subtext: 'From Term to ULIP to Endowment — filter by need, customize tenure and sum assured with live sliders, and book an expert session instantly.',
    primaryCta: 'Book Free Advisory',
    secondaryCta: 'Compare Products',
    accentColor: 'emerald',
    stat: { value: '4.9/5', label: 'Advisory Rating' },
    bgGradient: 'from-[#0F172A] via-[#1E2D45] to-[#0F172A]',
    icon: TrendingUp,
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onStartAssessment,
  onExploreProducts,
}) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setProgress(0);
      setAnimating(false);
    }, 300);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { next(); return 0; }
        return p + 2; // ~5s per slide (100 / 2 * 100ms)
      });
    }, 100);
    return () => clearInterval(interval);
  }, [next]);

  const slide = SLIDES[current];
  const SlideIcon = slide.icon;

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-[90vh] flex items-center"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E2D45 50%, #0F172A 100%)',
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT CONTENT ── */}
          <div
            key={current}
            className={`${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} transition-all duration-300`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-300 text-[12px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {slide.badge}
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.12] mb-6">
              {slide.headline.split(' ').map((word, i) => {
                const isHighlight = ['Precise', 'Exactly', 'Compare,'].includes(word);
                return isHighlight ? (
                  <span key={i} className="text-gradient-emerald">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                );
              })}
            </h1>

            {/* Subtext */}
            <p className="text-[17px] text-slate-300 leading-relaxed mb-10 max-w-xl">
              {slide.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                id={`hero-cta-primary-${slide.id}`}
                onClick={onStartAssessment}
                className="btn-emerald inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[15px] cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                {slide.primaryCta}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id={`hero-cta-secondary-${slide.id}`}
                onClick={onExploreProducts}
                className="btn-outline-white inline-flex items-center justify-center gap-2 px-7 py-4 text-[15px] cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                {slide.secondaryCta}
              </button>
            </div>

            {/* Stat highlight */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/8 w-fit">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <SlideIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{slide.stat.value}</div>
                <div className="text-xs text-slate-400 font-medium">{slide.stat.label}</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: VISUAL CARD ── */}
          <div
            key={`card-${current}`}
            className={`${animating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'} transition-all duration-300 delay-100`}
          >
            <div className="relative mx-auto max-w-md">
              {/* Decorative rings */}
              <div className="absolute -inset-6 rounded-3xl border border-emerald-500/8 pointer-events-none" />
              <div className="absolute -inset-12 rounded-3xl border border-emerald-500/4 pointer-events-none" />

              {/* Main card */}
              <div className="rounded-2xl bg-white/4 border border-white/10 backdrop-blur-md p-6 shadow-2xl shadow-black/40">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/8">
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Coverage Analysis</p>
                    <p className="text-white font-bold text-lg mt-0.5">Protection Dashboard</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[11px] font-bold">
                    LIVE
                  </div>
                </div>

                {/* Visual bars */}
                <div className="space-y-4">
                  {[
                    { label: 'Income Replacement', pct: 100, color: 'bg-blue-500', amount: '₹1.25 Cr' },
                    { label: 'Outstanding Liabilities', pct: 36, color: 'bg-amber-500', amount: '₹45 L' },
                    { label: 'Future Goals (PV)', pct: 36, color: 'bg-purple-500', amount: '₹45 L' },
                    { label: 'Existing Cover', pct: 20, color: 'bg-emerald-500', amount: '− ₹25 L' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className={`font-bold ${item.label === 'Existing Cover' ? 'text-emerald-400' : 'text-white'}`}>
                          {item.amount}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-700`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gap highlight */}
                <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">
                        Identified Gap
                      </p>
                      <p className="text-3xl font-black text-white">₹90,00,000</p>
                      <p className="text-xs text-slate-300 mt-1">
                        Est. Term Premium: <strong className="text-emerald-300">~₹980/mo</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Coverage Score</p>
                      <p className="text-4xl font-black text-amber-400">72%</p>
                      <p className="text-xs text-amber-400/70">Needs Improvement</p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  🔒 No marketing calls · Transparent actuarial math
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CAROUSEL CONTROLS ── */}
        <div className="flex items-center justify-center gap-6 mt-16">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/15 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Progress dots */}
          <div className="flex gap-3 items-center">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className="relative cursor-pointer"
              >
                {i === current ? (
                  <div className="relative w-10 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : (
                  <div className={`w-2 h-2 rounded-full transition-all ${
                    i < current ? 'bg-emerald-400/60' : 'bg-white/25'
                  }`} />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/15 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
