import React, { useState } from 'react';
import { CalculationResult, CustomerProfile } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatters';
import {
  ShieldAlert, ShieldCheck, ArrowRight, ArrowLeft, Info, HelpCircle,
  TrendingUp, Layers, CheckCircle, ChevronDown, ChevronUp, Sparkles, Scale
} from 'lucide-react';

interface Stage2NeedsCalculatorProps {
  calculation: CalculationResult;
  profile: CustomerProfile;
  onProceedToRecommendations: () => void;
  onBackToAssessment: () => void;
}

export const Stage2NeedsCalculator: React.FC<Stage2NeedsCalculatorProps> = ({
  calculation,
  profile,
  onProceedToRecommendations,
  onBackToAssessment
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);
  const [activeMethod, setActiveMethod] = useState<'net_needs' | 'hlv'>('net_needs');

  const { net_needs, hlv, summary_narrative, key_assumptions, suggested_annual_premium_budget_range } = calculation;
  const isCoverSufficient = net_needs.net_additional_life_cover_required === 0;

  // Chart proportions for visual breakdown
  const gross = Math.max(1, net_needs.gross_protection_resources_needed);
  const liabilitiesPct = Math.round((net_needs.outstanding_liabilities / gross) * 100);
  const incomePvPct = Math.round((net_needs.income_replacement_pv / gross) * 100);
  const goalsPvPct = Math.round((net_needs.goals_pv_total / gross) * 100);
  const otherPct = Math.round((net_needs.other_obligations / gross) * 100);

  const deductionsTotal = net_needs.total_existing_coverage_and_resources;
  const coveredRatioPct = Math.min(100, Math.round((deductionsTotal / gross) * 100));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Top Banner / Summary Statement */}
      <div className={`rounded-2xl p-6 sm:p-8 mb-8 border ${
        isCoverSufficient
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-gradient-to-r from-blue-950 via-[#0A192F] to-slate-900 border-teal-500/30 text-white shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isCoverSufficient ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
              }`}>
                Stage 2: Financial Needs Engine
              </span>
              <span className="text-xs text-slate-400 font-medium">Net Needs Approach</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isCoverSufficient ? 'Your Family Is Adequately Protected!' : 'Identified Additional Coverage Need'}
            </h2>
            <p className={`mt-2 text-sm leading-relaxed max-w-2xl ${isCoverSufficient ? 'text-emerald-800' : 'text-slate-300'}`}>
              {summary_narrative}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right bg-black/20 sm:bg-transparent p-4 sm:p-0 rounded-xl w-full sm:w-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Additional Cover Required
            </span>
            <span className={`text-3xl sm:text-4xl font-extrabold block mt-0.5 ${
              isCoverSufficient ? 'text-emerald-600' : 'text-teal-400'
            }`}>
              {formatINR(net_needs.net_additional_life_cover_required)}
            </span>
            <span className="text-[11px] text-slate-400">
              Floor at ₹0 (Deficit strictly quantified)
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Gross Protection Need */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">Gross Family Need</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatINR(net_needs.gross_protection_resources_needed)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Total capital necessary to replace income, retire liabilities, and secure milestone goals.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
            <span>Income + Debts + Goals</span>
            <span className="font-semibold text-slate-900">100% Gross Obligation</span>
          </div>
        </div>

        {/* Card 2: Existing Deductions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-emerald-700">Existing Resources Deducted</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              - {formatINR(net_needs.total_existing_coverage_and_resources)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Existing life cover ({formatINR(net_needs.existing_life_insurance_cover)}) + dedicated family assets ({formatINR(net_needs.eligible_financial_resources)}).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
            <span>Deducted Once (Zero double-count)</span>
            <span className="font-semibold text-emerald-600">{coveredRatioPct}% Pre-funded</span>
          </div>
        </div>

        {/* Card 3: Benchmark Term Budget Range */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-indigo-700">Estimated Term Cost</span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              ~{formatINR(suggested_annual_premium_budget_range.min_annual)}
              <span className="text-sm font-normal text-slate-500">/yr</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Monthly estimate: <strong>{formatINR(suggested_annual_premium_budget_range.min_monthly)} – {formatINR(suggested_annual_premium_budget_range.max_monthly)}/mo</strong> for pure term risk cover.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
            <span>Benchmark for Age {profile.age}</span>
            <span className="font-semibold text-blue-600">Pure Term Benchmark</span>
          </div>
        </div>

      </div>

      {/* Visual Breakdown & Component Allocation */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Transparent Financial Needs Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Every component in your gross family protection requirement is itemized below.
        </p>

        {/* Horizontal Visual Stack Bar */}
        <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex mb-3">
          {incomePvPct > 0 && (
            <div style={{ width: `${incomePvPct}%` }} className="h-full bg-blue-600" title={`Income Support: ${incomePvPct}%`} />
          )}
          {liabilitiesPct > 0 && (
            <div style={{ width: `${liabilitiesPct}%` }} className="h-full bg-indigo-600" title={`Liabilities: ${liabilitiesPct}%`} />
          )}
          {goalsPvPct > 0 && (
            <div style={{ width: `${goalsPvPct}%` }} className="h-full bg-teal-500" title={`Future Goals: ${goalsPvPct}%`} />
          )}
          {otherPct > 0 && (
            <div style={{ width: `${otherPct}%` }} className="h-full bg-slate-400" title={`Emergency Reserve: ${otherPct}%`} />
          )}
        </div>

        {/* Grid of the 4 breakdown components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* Income Replacement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Income Replacement (PV)</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {formatINR(net_needs.income_replacement_pv)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {profile.years_of_support_needed} years of {formatINR(profile.annual_household_expenses)}/yr (Nominal: {formatINR(net_needs.income_replacement_nominal)})
            </p>
          </div>

          {/* Liabilities */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Outstanding Debt</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {formatINR(net_needs.outstanding_liabilities)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Immediate liability cancellation so family is debt-free.
            </p>
          </div>

          {/* Future Goals */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Future Milestone Goals</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {formatINR(net_needs.goals_pv_total)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {net_needs.goals_breakdown.length} goals discounted to present value. (Nominal: {formatINR(net_needs.goals_nominal_total)})
            </p>
          </div>

          {/* Other / Buffer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Emergency Buffer</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {formatINR(net_needs.other_obligations)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Immediate medical and unexpected transitional reserve.
            </p>
          </div>

        </div>

        {/* Dynamic Goals Details Accordion */}
        {net_needs.goals_breakdown.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Future Milestone Goals Valuation Breakdown
            </h4>
            <div className="divide-y divide-slate-100">
              {net_needs.goals_breakdown.map((g, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{g.description} ({g.target_years} yrs)</span>
                  <div className="text-right">
                    <span className="text-slate-900 font-bold">{formatINR(g.present_value)} PV</span>
                    <span className="text-slate-400 ml-2">(Nominal: {formatINR(g.nominal_amount)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HUMAN LIFE VALUE (HLV) COMPARISON SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Alternative Methodology Comparison: Human Life Value (HLV)
              </h3>
              <p className="text-xs text-slate-500">
                Compare your Net Needs results with the classical economic earning-power model.
              </p>
            </div>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs">
            <button
              onClick={() => setActiveMethod('net_needs')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMethod === 'net_needs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Net Needs ({formatINR(net_needs.net_additional_life_cover_required, true)})
            </button>
            <button
              onClick={() => setActiveMethod('hlv')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeMethod === 'hlv' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              HLV ({formatINR(hlv.hlv_additional_cover_needed, true)})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2">How HLV Was Calculated:</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex justify-between">
                <span>Annual Gross Income:</span>
                <strong className="text-slate-900">{formatINR(hlv.gross_annual_income)}</strong>
              </li>
              <li className="flex justify-between">
                <span>Personal Consumption Share ({formatPercent(hlv.personal_consumption_deduction_pct)}):</span>
                <strong className="text-rose-600">- {formatINR(hlv.personal_consumption_deduction_amount)}</strong>
              </li>
              <li className="flex justify-between">
                <span>Net Family Contribution:</span>
                <strong className="text-teal-700">{formatINR(hlv.net_annual_family_contribution)}/year</strong>
              </li>
              <li className="flex justify-between">
                <span>Remaining Working Horizon:</span>
                <strong className="text-slate-900">{hlv.remaining_working_years} years (till age {profile.assumed_retirement_age})</strong>
              </li>
              <li className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Gross Human Life Value:</span>
                <strong className="text-blue-700">{formatINR(hlv.gross_human_life_value)}</strong>
              </li>
              <li className="flex justify-between">
                <span>Existing Cover & Earmarked Assets:</span>
                <strong className="text-emerald-700">- {formatINR(hlv.existing_cover_and_resources_deducted)}</strong>
              </li>
              <li className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900">HLV Net Additional Cover:</span>
                <strong className="text-indigo-700 font-extrabold">{formatINR(hlv.hlv_additional_cover_needed)}</strong>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-blue-950 text-sm mb-2">Why Do the Two Methods Differ?</h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Net Needs ({formatINR(net_needs.net_additional_life_cover_required)})</strong> directly sizes your cover based on actual living expenses, loan balances, and concrete milestone goals.
              </p>
              <p className="text-xs text-blue-900 mt-2 leading-relaxed">
                <strong>Human Life Value ({formatINR(hlv.hlv_additional_cover_needed)})</strong> capitalizes your total economic earning power until retirement. If your future income growth is high and living expenses are modest, HLV may recommend higher coverage.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200/80 text-[11px] text-blue-800 font-semibold">
              Advice: Insurance Mantra uses Net Needs as primary because it avoids inflating premiums beyond your family's actual liability needs.
            </div>
          </div>

        </div>
      </div>

      {/* Expandable "How was this calculated?" section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-8">
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">
              How was this calculated? (Inputs, Formulas & Assumptions)
            </span>
          </div>
          {showFormulaDetails ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showFormulaDetails && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-4 animate-fade-in">
            <p>
              <strong>Calculation Method:</strong> Net Needs Approach with {net_needs.is_discounted ? `a ${formatPercent(net_needs.discount_rate_used)} real discount rate` : 'nominal undiscounted cash outlays'}.
            </p>
            
            <div className="p-4 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-800 space-y-1.5">
              <p>• Gross Need = Outstanding Liabilities (₹{net_needs.outstanding_liabilities.toLocaleString()})</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ PV of Living Support (₹{net_needs.income_replacement_pv.toLocaleString()})</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ PV of Milestone Goals (₹{net_needs.goals_pv_total.toLocaleString()})</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ Emergency Reserve (₹{net_needs.other_obligations.toLocaleString()})</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ₹{net_needs.gross_protection_resources_needed.toLocaleString()}</p>
              <p className="mt-2 text-emerald-700">• Deductions = Existing Insurance (₹{net_needs.existing_life_insurance_cover.toLocaleString()}) + Earmarked Assets (₹{net_needs.eligible_financial_resources.toLocaleString()}) = ₹{net_needs.total_existing_coverage_and_resources.toLocaleString()}</p>
              <p className="mt-2 text-teal-700 font-bold">• Additional Life Cover Required = Max(0, Gross Need - Deductions) = ₹{net_needs.net_additional_life_cover_required.toLocaleString()}</p>
            </div>

            <div className="space-y-1">
              <h5 className="font-bold text-slate-900">Key Documented Assumptions:</h5>
              <ul className="list-disc pl-5 space-y-1">
                {key_assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToAssessment}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Financial Inputs</span>
        </button>

        <button
          id="proceed-to-stage3-btn"
          onClick={onProceedToRecommendations}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>Compare Suitable Product Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
