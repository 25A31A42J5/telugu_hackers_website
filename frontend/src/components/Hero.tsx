import React from 'react';
import { ShieldCheck, Calculator, ArrowRight, CheckCircle2, Sliders, TrendingUp, Sparkles, BookOpen, Lock } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface HeroProps {
  onCalculateCover: () => void;
  onExploreHowItWorks: () => void;
  onLoadQuickDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onCalculateCover,
  onExploreHowItWorks,
  onLoadQuickDemo,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0D1E3A] to-[#0A192F] text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Hackathon & Team Pill */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-semibold text-teal-300">AI Frontier Challenge 2026 — BFSI Track</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-200">Developed by <strong className="text-white font-bold">Telugu Hackers</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Understand Your Needs.{' '}
              <span className="bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Compare Your Options. Protect Your Future.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover how much life insurance your family may need, compare suitable protection options, and make informed financial decisions with transparent, AI-assisted guidance.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-primary-cta"
                onClick={onCalculateCover}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calculator className="w-5 h-5 text-teal-200" />
                <span>Calculate My Life Cover</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={onExploreHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-300" />
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Demo profile quick load prompt for judges */}
            <div className="mt-5 text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Hackathon Judge?</span>
              <button
                onClick={onLoadQuickDemo}
                className="text-teal-300 hover:text-teal-200 underline font-semibold cursor-pointer"
              >
                Load Pre-filled Sample Household Profile (₹18L Income / 32Y)
              </button>
            </div>

            {/* Three concise Value Propositions */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Personalized Coverage</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Actuarial Net Needs model tailored to liabilities, dependents & future goals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sliders className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Transparent Logic</h4>
                  <p className="text-xs text-slate-400 mt-0.5">No hidden multiples. Full mathematical breakdown with zero black-box bias.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Interactive Planning</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Scenario sliders, real-time recalculations & digital advisory dialogue.</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Custom Interactive Coverage Graphic & Family Protection Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container */}
              <div className="rounded-2xl bg-gradient-to-b from-[#112240] to-[#0A192F] p-6 border border-slate-700/80 shadow-2xl shadow-black/50 relative">
                
                {/* Header of simulated card */}
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Coverage Health Index</p>
                      <p className="text-[10px] text-slate-400">Net Needs Approach Visualization</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Live Model
                  </span>
                </div>

                {/* Simulated Visual Breakdown Chart */}
                <div className="mt-5 space-y-4">
                  
                  {/* Needs Block */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">Gross Family Protection Need</span>
                      <span className="text-white font-bold">{formatINR(12500000)}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-700 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Home Loan + Expenses + Child Edu</span>
                      <span>100% Gross Obligation</span>
                    </div>
                  </div>

                  {/* Deductions Block */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">Existing Cover & Earmarked Assets</span>
                      <span className="text-emerald-400 font-bold">- {formatINR(3500000)}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-700 overflow-hidden">
                      <div className="w-[28%] h-full bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Subtracted once to avoid double-charging</span>
                      <span>28% Covered</span>
                    </div>
                  </div>

                  {/* Identified Gap Highlight */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/70 via-blue-950/70 to-slate-900 border border-teal-500/40 shadow-inner">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-300">
                          Identified Additional Cover Gap
                        </span>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                          {formatINR(9000000)}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Estimated Pure Term Cost: <strong className="text-teal-300">~₹980/month</strong>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Honest Disclaimer pill */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>No marketing calls. No spam. Transparent actuarial math.</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
