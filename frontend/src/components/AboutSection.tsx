import React, { useState } from 'react';
import {
  CheckCircle2, Zap, Clock, Users, ShieldCheck, TrendingUp, BookOpen,
  BarChart3, ChevronRight
} from 'lucide-react';

interface AboutSectionProps {
  onStartAssessment: () => void;
}

const TABS = [
  {
    id: 'approach',
    label: 'Our Approach',
    icon: BookOpen,
    heading: 'Human-First, Math-Backed Advisory',
    body: `Insurance Mantra replaces guesswork with science. We combine actuarial Net Needs methodology with Human Life Value modelling to compute exactly what your family needs — exposing the true protection gap that generic 10x income multiples miss entirely.`,
    points: [
      'No hidden assumptions or black-box multipliers',
      'IRDAI-aligned product benchmarks for credibility',
      'Real-time scenario modelling with live sliders',
      'Transparent formula disclosure at every step',
    ],
  },
  {
    id: 'hlv',
    label: 'Human Life Value',
    icon: TrendingUp,
    heading: 'Calculate Your Economic Worth to Your Family',
    body: `The Human Life Value (HLV) method estimates the present value of your total future earning capacity, adjusted for personal consumption and existing resources. It provides a ceiling estimate for life coverage that complements the Net Needs floor.`,
    points: [
      'Factors in gross income, dependents, and working years',
      'Applies actuarial discounting at 6-8% rate',
      'Deducts personal consumption and existing assets',
      'Cross-validates with Net Needs for reliable range',
    ],
  },
  {
    id: 'engine',
    label: 'Net Needs Engine',
    icon: BarChart3,
    heading: 'Precision-Calculated Protection Gap',
    body: `Our Net Needs Engine calculates your gross protection obligation — liabilities, present value of income replacement, and future goals — then deducts eligible assets and existing coverage. The remainder is your true additional coverage requirement.`,
    points: [
      'Itemised breakdown: liabilities + income PV + goals PV',
      'Deducts savings, existing cover, and earmarked assets',
      'Optional present-value discounting at custom rate',
      'Instantly recalculates on any profile change',
    ],
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Zero Hidden Costs',
    desc: 'Transparent premium breakdowns with full actuarial formula disclosure. No surprise charges.',
    color: 'emerald',
  },
  {
    icon: ShieldCheck,
    title: 'Algorithmic Matching',
    desc: 'Tailored product selection without sales bias. Our engine scores fit across 8 dimensions.',
    color: 'blue',
  },
  {
    icon: Clock,
    title: '24/7 Digital Advice',
    desc: 'On-demand financial expert consultations powered by our intelligent advisory assistant.',
    color: 'gold',
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-500',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-500',
  },
  gold: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    badge: 'bg-amber-500',
  },
};

export const AboutSection: React.FC<AboutSectionProps> = ({ onStartAssessment }) => {
  const [activeTab, setActiveTab] = useState('approach');
  const tab = TABS.find(t => t.id === activeTab)!;
  const TabIcon = tab.icon;

  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Label */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Why Insurance Mantra
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Insurance Guidance That's Actually{' '}
            <span className="text-gradient-emerald">Trustworthy</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base">
            We believe life insurance decisions should be grounded in mathematics, not marketing pressure.
          </p>
        </div>

        {/* ── MAIN SPLIT LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">

          {/* LEFT: Graphic */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Dashboard mockup */}
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E2D45] rounded-2xl p-6 shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/8">
                  <div>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Insurance Mantra</p>
                    <p className="text-white font-bold text-lg">Advisory Dashboard</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                {/* Profile row */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Srinivas Rao, 32</p>
                    <p className="text-slate-400 text-xs">Salaried · ₹18L/yr · 2 Dependents</p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
                    LIVE
                  </span>
                </div>

                {/* Metric rows */}
                {[
                  { label: 'Gross Protection Need', val: '₹1.25 Cr', pct: 100, color: 'bg-blue-500' },
                  { label: 'Existing Cover & Assets', val: '₹35 L', pct: 28, color: 'bg-emerald-500' },
                  { label: 'Additional Cover Gap', val: '₹90 L', pct: 72, color: 'bg-amber-500' },
                ].map((m, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{m.label}</span>
                      <span className="text-white font-bold">{m.val}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}

                {/* Recommended product row */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 text-xs font-bold">Recommended: Term Life, 30Y · ₹980/mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Coverage Score</p>
                <p className="text-lg font-black text-slate-900">72% → 100%</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Tabs */}
          <div className="order-1 lg:order-2">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-100 mb-6">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-white shadow-sm text-emerald-700'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div key={activeTab} className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <TabIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{tab.heading}</h3>
              </div>

              <p className="text-slate-600 leading-relaxed mb-6">{tab.body}</p>

              <ul className="space-y-3">
                {tab.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">{pt}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onStartAssessment}
                className="mt-8 btn-emerald inline-flex items-center gap-2 px-6 py-3 text-sm cursor-pointer"
              >
                Start Free Assessment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── FEATURE BADGES GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const c = colorMap[feat.color];
            return (
              <div key={i} className={`finanza-card p-6 border ${c.border}`}>
                <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center mb-4`}>
                  <feat.icon className={`w-6 h-6 ${c.icon}`} />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-2">{feat.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
