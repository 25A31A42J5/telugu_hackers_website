import React, { useState, useEffect } from 'react';
import { CustomerProfile, ProductRecommendation, ScenarioCustomizationResponse } from '../../types';
import { customizeScenario } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import {
  ShieldCheck, Sliders, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft,
  ExternalLink, RefreshCw, Sparkles, Filter, Check, XCircle, AlertCircle, Info, FileCheck
} from 'lucide-react';

interface Stage3ProductRecommenderProps {
  profile: CustomerProfile;
  recommendations: ProductRecommendation[];
  calculatedGap: number;
  onProceedToAdvisory: () => void;
  onBackToCalculator: () => void;
}

export const Stage3ProductRecommender: React.FC<Stage3ProductRecommenderProps> = ({
  profile,
  recommendations,
  calculatedGap,
  onProceedToAdvisory,
  onBackToCalculator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(
    recommendations.length > 0 ? recommendations[0] : null
  );

  // Customization sliders state
  const [customSumAssured, setCustomSumAssured] = useState<number>(
    calculatedGap > 0 ? calculatedGap : 5000000
  );
  const [customTenure, setCustomTenure] = useState<number>(
    profile.desired_policy_duration || 30
  );
  const [customBudget, setCustomBudget] = useState<number>(
    profile.preferred_annual_premium_budget || 30000
  );

  const [customScenario, setCustomScenario] = useState<ScenarioCustomizationResponse | null>(null);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Sync when selected product changes or sliders move
  useEffect(() => {
    if (selectedProduct) {
      handleRecalculateScenario(selectedProduct.product.id, customSumAssured, customTenure, customBudget);
    }
  }, [selectedProduct, customSumAssured, customTenure, customBudget]);

  const handleRecalculateScenario = async (
    prodId: string,
    sum: number,
    tenure: number,
    budget: number
  ) => {
    setIsCustomizing(true);
    try {
      const res = await customizeScenario(profile, prodId, sum, tenure, budget);
      setCustomScenario(res);
    } catch (err) {
      console.error("Scenario customization error:", err);
    } finally {
      setIsCustomizing(false);
    }
  };

  const filteredRecs = recommendations.filter(r => {
    if (selectedCategory === 'all') return true;
    return r.product.category === selectedCategory;
  });

  return (
    <div id="compare-plans" className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Stage Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Stage 3 of 4
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Insurance Plan Recommendations & Customizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent assessment displaying full plan overviews, verified advantages, and statutory disadvantages for each option.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
            {['all', 'term', 'whole_life', 'endowment', 'ulip'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Plans' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 space-y-8">
          {filteredRecs.map((rec) => {
            const isSelected = selectedProduct?.product.id === rec.product.id;
            return (
              <div
                key={rec.product.id}
                onClick={() => setSelectedProduct(rec)}
                className={`rounded-2xl border transition-all cursor-pointer p-6 sm:p-7 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/15 ring-2 ring-blue-500/25 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* 1. PLAN OVERVIEW HEADER */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        rec.fit_score >= 75
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : rec.fit_score >= 50
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {rec.fit_score}% Match Score
                      </span>

                      <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {rec.category_label}
                      </span>

                      {isSelected && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-600 text-white flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active in Scenario Modeler</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-teal-600" />
                      <span>{rec.premium_verification_status || rec.product.verification_status}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    {rec.product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Insurer: <strong className="text-slate-800">{rec.product.provider}</strong> • Data Citation: {rec.product.data_source_citation}
                  </p>

                  {/* Intended Purpose Card */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-semibold block mb-0.5">Intended Purpose:</strong>
                    {rec.intended_purpose || rec.product.intended_purpose}
                  </div>

                  {/* Key Metrics Grid: Coverage Amount, Tenure, Premium, Affordability */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-slate-500 text-[11px] block">Recommended Cover</span>
                      <strong className="text-base text-slate-900 font-extrabold block mt-0.5">
                        {formatINR(rec.recommended_coverage_amount || calculatedGap)}
                      </strong>
                      <span className="text-[10px] text-teal-700 font-medium">Full Gap Protection</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-slate-500 text-[11px] block">Recommended Tenure</span>
                      <strong className="text-base text-slate-900 font-extrabold block mt-0.5">
                        {rec.recommended_tenure || profile.desired_policy_duration} Years
                      </strong>
                      <span className="text-[10px] text-slate-500 font-medium">Until age {profile.age + (rec.recommended_tenure || profile.desired_policy_duration)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-slate-500 text-[11px] block">Estimated Premium</span>
                      <strong className="text-base text-blue-700 font-extrabold block mt-0.5">
                        {formatINR(rec.estimated_annual_premium)}
                        <span className="text-xs font-normal text-slate-500">/yr</span>
                      </strong>
                      <span className="text-[10px] text-slate-600 font-medium">~{formatINR(rec.estimated_monthly_premium)}/month</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                      <span className="text-slate-500 text-[11px] block">Budget Fit Status</span>
                      <div>
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                          rec.is_budget_affordable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.is_budget_affordable ? 'Affordable' : 'Budget Alert'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 truncate" title={rec.affordability_notes}>
                          {rec.affordability_notes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Why it Matches Explanation */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Why This Plan Matches Your Profile:</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {rec.match_reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 bg-blue-50/40 p-2 rounded-lg border border-blue-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. ADVANTAGES & DISADVANTAGES COMPARISON GRID */}
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* Advantages Box (Green/Mint Accent) */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-200/60">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <h4 className="text-sm font-bold text-emerald-950">
                          Plan Advantages & Key Benefits
                        </h4>
                      </div>

                      <ul className="space-y-2.5 text-xs text-emerald-900 leading-relaxed">
                        {(rec.advantages || rec.product.advantages || rec.product.key_benefits).map((adv, aidx) => (
                          <li key={aidx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-200/50 text-[11px] text-emerald-800 font-medium">
                      Suitability: {rec.product.suitability_summary}
                    </div>
                  </div>

                  {/* Disadvantages & Limitations Box (Amber/Rose Accent) */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-200/60">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-amber-950">
                          Disadvantages & Policy Limitations
                        </h4>
                      </div>

                      <ul className="space-y-2.5 text-xs text-amber-900 leading-relaxed">
                        {(rec.disadvantages_and_limitations || rec.product.disadvantages_and_limitations || rec.product.exclusions_and_conditions).map((dis, didx) => (
                          <li key={didx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                            <span>{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/50 text-[11px] text-amber-900 font-medium">
                      Trade-off Notice: {rec.trade_offs[0] || "Review terms before purchase."}
                    </div>
                  </div>

                </div>

                {/* Card Action Bar */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <span>{isSelected ? '✓ Currently Selected for Interactive Customization below' : 'Click to test this plan in scenario modeler'}</span>
                  </div>

                  <a
                    href={rec.product.official_info_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <span>View Public IRDAI Product Filing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE POLICY CUSTOMIZATION WORKSPACE */}
      {selectedProduct && (
        <div className="bg-gradient-to-b from-[#112240] to-[#0A192F] text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-400" />
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Interactive Scenario Modeler
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Customizing: <strong className="text-teal-300">{selectedProduct.product.name}</strong> ({selectedProduct.category_label})
              </p>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
              Live Actuarial Recalculation
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Desired Sum Assured */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Desired Sum Assured (Coverage)</span>
                  <span className="text-teal-400 font-extrabold text-base">{formatINR(customSumAssured)}</span>
                </div>
                <input
                  type="range"
                  min="2500000"
                  max="50000000"
                  step="500000"
                  value={customSumAssured}
                  onChange={(e) => setCustomSumAssured(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Min: ₹25 Lakhs</span>
                  <span>Calculated Gap: {formatINR(calculatedGap)}</span>
                  <span>Max: ₹5 Crores</span>
                </div>
              </div>

              {/* Slider 2: Policy Tenure */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Policy Tenure (Duration)</span>
                  <span className="text-blue-400 font-extrabold text-base">{customTenure} Years</span>
                </div>
                <input
                  type="range"
                  min={selectedProduct.product.min_tenure}
                  max={selectedProduct.product.max_tenure}
                  step="1"
                  value={customTenure}
                  onChange={(e) => setCustomTenure(parseInt(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Min: {selectedProduct.product.min_tenure} yrs</span>
                  <span>Coverage till age {profile.age + customTenure}</span>
                  <span>Max: {selectedProduct.product.max_tenure} yrs</span>
                </div>
              </div>

              {/* Slider 3: Preferred Premium Budget */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Annual Premium Budget</span>
                  <span className="text-indigo-300 font-extrabold text-base">{formatINR(customBudget)}/yr</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹5,000/yr</span>
                  <span>Comfortable cashflow limit</span>
                  <span>₹1,00,000/yr</span>
                </div>
              </div>

            </div>

            {/* Right Display: Instant Recalculation Output Card */}
            <div className="lg:col-span-5 bg-slate-900/80 rounded-xl p-5 border border-slate-700/80">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Scenario Impact Analysis
              </span>

              {isCustomizing ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-400 mb-2" />
                  <span>Recalculating scenario...</span>
                </div>
              ) : customScenario ? (
                <div className="mt-3 space-y-4 text-xs">
                  
                  {/* Premium figures */}
                  <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 text-[11px] block">Estimated Annual Premium</span>
                    <span className="text-2xl font-extrabold text-white block mt-0.5">
                      {formatINR(customScenario.estimated_annual_premium)}
                    </span>
                    <span className="text-[11px] text-teal-300">
                      ~{formatINR(customScenario.estimated_monthly_premium)} / month
                    </span>
                  </div>

                  {/* Coverage Adequacy */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">Coverage Adequacy</span>
                      <span className="text-white font-bold">{customScenario.coverage_adequacy_pct}% of identified gap</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, customScenario.coverage_adequacy_pct)}%` }}
                        className={`h-full rounded-full ${
                          customScenario.coverage_adequacy_pct >= 95 ? 'bg-emerald-400' : 'bg-teal-400'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Remaining Unfunded Gap:</span>
                      <strong className="text-white">{formatINR(customScenario.remaining_coverage_gap)}</strong>
                    </div>
                  </div>

                  {/* Budget Fit Status */}
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-[11px]">
                    <span className="text-slate-400 block mb-0.5">Budget Fit Status:</span>
                    <span className="text-slate-200 font-medium">{customScenario.budget_fit}</span>
                  </div>

                  {/* Regulatory Disclaimer */}
                  <p className="text-[10px] text-slate-400 italic">
                    {customScenario.disclaimer}
                  </p>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToCalculator}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Needs Engine</span>
        </button>

        <button
          id="proceed-to-stage4-btn"
          onClick={onProceedToAdvisory}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>Get Advisory & Book Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
