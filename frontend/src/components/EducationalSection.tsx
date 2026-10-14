import React, { useState } from 'react';
import { BookOpen, Shield, TrendingUp, Layers, HelpCircle, Check, X, AlertTriangle } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'terms' | 'exclusions'>('categories');

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Financial Literacy Hub
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Demystifying Life Insurance Terminology
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Clear, honest comparisons to help you understand what you are buying before committing your hard-earned income.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2 p-1.5 rounded-xl bg-slate-100 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'categories' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Product Categories
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'terms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Key Terminology
            </button>
            <button
              onClick={() => setActiveTab('exclusions')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'exclusions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exclusions & Conditions
            </button>
          </div>
        </div>

        {/* Tab 1: Product Categories Comparison */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            
            {/* Term Insurance */}
            <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-50/20 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                    Pure Protection
                  </span>
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Term Life Insurance</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Provides high death benefit for a specific period. If the insured passes away during the term, beneficiaries receive the sum assured.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Highest cover for lowest cost</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Ideal for debt & dependents</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <X className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>No maturity benefit (pure risk cover)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-blue-200/60 text-[11px] text-blue-800 font-semibold">
                Best For: Primary breadwinners with high debt or young families.
              </div>
            </div>

            {/* Whole Life */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                    Lifelong & Estate
                  </span>
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Whole Life Insurance</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Covers you for life (typically up to age 99 or 100). Combines a death benefit with guaranteed cash value accumulation.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Coverage lasts for entire lifetime</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Estate transfer & wealth succession</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <X className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>3x - 5x higher premium than pure term</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-indigo-800 font-semibold">
                Best For: Individuals creating an inheritance or legacy fund.
              </div>
            </div>

            {/* Endowment Plans */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Guaranteed Savings
                  </span>
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Endowment Plans</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Traditional plans paying a lump sum on survival till maturity, or death benefit plus accumulated bonuses to family if death occurs earlier.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Disciplined forced savings habit</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Guaranteed maturity payout</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <X className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Moderate return (often 4.5% - 5.5% p.a.)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold">
                Best For: Ultra-conservative investors needing guaranteed capital.
              </div>
            </div>

            {/* ULIPs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    Market-Linked
                  </span>
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Unit Linked Plans (ULIP)</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  A portion of premium covers life risk; remainder is invested in equity, debt, or hybrid funds of your choice with 5-year lock-in.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Potential for high market-linked returns</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Tax-free fund switches between asset classes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <X className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Returns not guaranteed; market risk is yours</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-semibold">
                Best For: Long-term wealth creators comfortable with equity cycles.
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Key Terminology */}
        {activeTab === 'terms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>Sum Assured vs. Premium</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                <strong>Sum Assured</strong> is the committed guaranteed capital paid out to your nominee upon death. <strong>Premium</strong> is the installment amount you pay (annually, quarterly, or monthly) to maintain the policy in force. A high sum assured (₹1 Crore) can cost as low as ₹10,000–₹14,000/year in pure term insurance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Policy Tenure vs. Premium Payment Term</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                <strong>Policy Tenure</strong> is how long you are covered (e.g., 30 years or till age 65). <strong>Premium Payment Term (PPT)</strong> is how long you pay premiums. In "Regular Pay", PPT equals Tenure. In "Limited Pay", you can finish paying in 10 or 15 years while remaining insured for 30 years.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <span>Claim Settlement Ratio (CSR)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The percentage of claims paid by an insurer out of total claims received in a financial year. Look for insurers with a CSR above 98% and inspect both the ratio by number of claims and by claim amount value published in annual IRDAI reports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <span>Section 45 of Insurance Act (3-Year Clause)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mandates that after a life insurance policy has completed 3 continuous years from inception or revival, no insurer can repudiate or dispute a claim on any ground, including misstatement or non-disclosure. Always disclose all health facts truthfully at inception.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Exclusions and Conditions */}
        {activeTab === 'exclusions' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">Standard Life Insurance Conditions & Exclusions</h3>
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Every policy contract contains explicit statutory exclusions to prevent moral hazard and adverse selection. Here are the core clauses regulated by IRDAI:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">1. Suicide Exclusion</h5>
                <p className="text-slate-600 leading-relaxed">
                  Suicide committed within 12 months of policy issuance or revival limits payment to 80%–100% of the total premiums paid. Full sum assured is payable after 12 months.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">2. Non-Disclosure & Fraud</h5>
                <p className="text-slate-600 leading-relaxed">
                  Deliberate failure to disclose pre-existing chronic conditions, nicotine or tobacco habits, or dangerous occupations within the first 3 policy years can void coverage.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">3. Rider Waiting Periods</h5>
                <p className="text-slate-600 leading-relaxed">
                  While base death benefit starts on Day 1, Critical Illness riders typically have a 90-day initial waiting period and a 14 to 30-day survival requirement after diagnosis.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
