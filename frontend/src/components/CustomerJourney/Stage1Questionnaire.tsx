import React, { useState } from 'react';
import { CustomerProfile, FinancialGoal } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  User, Briefcase, IndianRupee, HeartHandshake, Shield, Sparkles,
  Plus, Trash2, AlertCircle, ArrowRight, CheckCircle2, RefreshCw, Sliders
} from 'lucide-react';

interface Stage1QuestionnaireProps {
  initialProfile: CustomerProfile;
  onSubmit: (profile: CustomerProfile) => void;
  onLoadSample: () => void;
  isLoading: boolean;
}

export const Stage1Questionnaire: React.FC<Stage1QuestionnaireProps> = ({
  initialProfile,
  onSubmit,
  onLoadSample,
  isLoading
}) => {
  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Sync when initialProfile changes (e.g. from sample load)
  React.useEffect(() => {
    setProfile(initialProfile);
    setErrors({});
  }, [initialProfile]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!profile.age || profile.age < 18 || profile.age > 75) {
      errs.age = "Age must be between 18 and 75 years.";
    }

    if (profile.annual_gross_income < 0) {
      errs.annual_gross_income = "Annual gross income cannot be negative.";
    }

    if (profile.annual_household_expenses < 0) {
      errs.annual_household_expenses = "Household expenses cannot be negative.";
    }

    if (profile.dependents_count < 0) {
      errs.dependents_count = "Dependents count cannot be negative.";
    }

    if (profile.years_of_support_needed < 1 || profile.years_of_support_needed > 50) {
      errs.years_of_support_needed = "Support years must be between 1 and 50 years.";
    }

    if (profile.outstanding_liabilities < 0) {
      errs.outstanding_liabilities = "Liabilities cannot be negative.";
    }

    if (profile.existing_life_insurance < 0) {
      errs.existing_life_insurance = "Existing cover cannot be negative.";
    }

    if (profile.current_savings < 0) {
      errs.current_savings = "Savings cannot be negative.";
    }

    if (profile.eligible_assets_for_family < 0) {
      errs.eligible_assets_for_family = "Eligible assets cannot be negative.";
    } else if (profile.eligible_assets_for_family > profile.current_savings && profile.current_savings > 0) {
      errs.eligible_assets_for_family = "Assets earmarked for family protection cannot exceed your total savings.";
    }

    if (profile.preferred_annual_premium_budget < 0) {
      errs.preferred_annual_premium_budget = "Budget cannot be negative.";
    }

    // Check goals
    profile.future_goals.forEach((g, idx) => {
      if (!g.description.trim()) {
        errs[`goal_desc_${idx}`] = "Goal description is required.";
      }
      if (g.estimated_amount <= 0) {
        errs[`goal_amt_${idx}`] = "Goal amount must be greater than 0.";
      }
      if (g.target_years < 1 || g.target_years > 50) {
        errs[`goal_years_${idx}`] = "Horizon must be between 1 and 50 years.";
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(profile);
    }
  };

  const handleAddGoal = () => {
    setProfile(prev => ({
      ...prev,
      future_goals: [
        ...prev.future_goals,
        { description: 'Child Higher Education', estimated_amount: 2500000, target_years: 15 }
      ]
    }));
  };

  const handleRemoveGoal = (index: number) => {
    setProfile(prev => ({
      ...prev,
      future_goals: prev.future_goals.filter((_, i) => i !== index)
    }));
  };

  const handleGoalChange = (index: number, field: keyof FinancialGoal, value: string | number) => {
    setProfile(prev => {
      const updated = [...prev.future_goals];
      updated[index] = {
        ...updated[index],
        [field]: field === 'description' ? value : Number(value)
      };
      return { ...prev, future_goals: updated };
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Stage Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Stage 1 of 4
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Financial Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide your financial details to calculate your family's exact net protection requirement.
            </p>
          </div>

          <button
            type="button"
            id="load-sample-btn"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Load Sample Profile (₹18L Income)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          
          {/* SECTION 1: Personal Profile */}
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <span>1. Personal & Employment Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Age (Years) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="75"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
              </div>

              {/* Employment Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employment Category *
                </label>
                <select
                  value={profile.employment_category}
                  onChange={(e) => setProfile({ ...profile, employment_category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="salaried">Salaried Professional</option>
                  <option value="self_employed">Self-Employed Professional</option>
                  <option value="business_owner">Business Owner / Entrepreneur</option>
                  <option value="other">Other / Freelance</option>
                </select>
              </div>

              {/* Number of Dependents */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Financial Dependents *
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={profile.dependents_count}
                  onChange={(e) => setProfile({ ...profile, dependents_count: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-400">Spouse, children, dependent parents</span>
                {errors.dependents_count && <p className="text-xs text-rose-500 mt-1">{errors.dependents_count}</p>}
              </div>

              {/* Annual Gross Income */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Gross Income (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={profile.annual_gross_income || ''}
                  onChange={(e) => setProfile({ ...profile, annual_gross_income: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-teal-600 font-medium">{formatINR(profile.annual_gross_income)}/year</span>
                {errors.annual_gross_income && <p className="text-xs text-rose-500 mt-1">{errors.annual_gross_income}</p>}
              </div>

              {/* Annual Household Expenses */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Household Expenses (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="25000"
                  value={profile.annual_household_expenses || ''}
                  onChange={(e) => setProfile({ ...profile, annual_household_expenses: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-teal-600 font-medium">
                  {formatINR(profile.annual_household_expenses)}/yr (~{formatINR(Math.round(profile.annual_household_expenses / 12))}/mo)
                </span>
                {errors.annual_household_expenses && <p className="text-xs text-rose-500 mt-1">{errors.annual_household_expenses}</p>}
              </div>

              {/* Years of Support Needed */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Support Required *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={profile.years_of_support_needed || ''}
                  onChange={(e) => setProfile({ ...profile, years_of_support_needed: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-400">Until youngest child is self-sufficient</span>
                {errors.years_of_support_needed && <p className="text-xs text-rose-500 mt-1">{errors.years_of_support_needed}</p>}
              </div>

            </div>
          </div>

          {/* SECTION 2: Financial Obligations & Existing Resources */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>2. Liabilities, Existing Cover & Earmarked Assets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Outstanding Liabilities */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outstanding Liabilities / Loans (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={profile.outstanding_liabilities || ''}
                  onChange={(e) => setProfile({ ...profile, outstanding_liabilities: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-500">Home loan, car loan, personal debts: {formatINR(profile.outstanding_liabilities)}</span>
                {errors.outstanding_liabilities && <p className="text-xs text-rose-500 mt-1">{errors.outstanding_liabilities}</p>}
              </div>

              {/* Existing Life Cover */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Existing Life Insurance Cover (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={profile.existing_life_insurance || ''}
                  onChange={(e) => setProfile({ ...profile, existing_life_insurance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-emerald-600 font-medium">Subtracted to avoid double-cover: {formatINR(profile.existing_life_insurance)}</span>
                {errors.existing_life_insurance && <p className="text-xs text-rose-500 mt-1">{errors.existing_life_insurance}</p>}
              </div>

              {/* Total Current Liquid Savings */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Current Savings / Investments (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={profile.current_savings || ''}
                  onChange={(e) => setProfile({ ...profile, current_savings: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-500">Total liquid portfolio: {formatINR(profile.current_savings)}</span>
                {errors.current_savings && <p className="text-xs text-rose-500 mt-1">{errors.current_savings}</p>}
              </div>

              {/* Eligible Earmarked Assets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assets Dedicated for Family Protection (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={profile.eligible_assets_for_family || ''}
                  onChange={(e) => setProfile({ ...profile, eligible_assets_for_family: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-emerald-600 font-medium">Available to cushion family: {formatINR(profile.eligible_assets_for_family)}</span>
                {errors.eligible_assets_for_family && <p className="text-xs text-rose-500 mt-1">{errors.eligible_assets_for_family}</p>}
              </div>

              {/* Other Obligations / Emergency Buffer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Other Obligations / Emergency Buffer (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="25000"
                  value={profile.other_obligations || ''}
                  onChange={(e) => setProfile({ ...profile, other_obligations: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-500">Immediate liquidity reserve: {formatINR(profile.other_obligations)}</span>
              </div>

            </div>
          </div>

          {/* SECTION 3: Dynamic Future Financial Goals */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-teal-600" />
                <span>3. Future Milestone Goals (Child Education, Marriage, Housing)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddGoal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>

            {profile.future_goals.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No future milestone goals added yet. Click "+ Add Goal" to safeguard milestones like children's college education or wedding expenses.
              </div>
            ) : (
              <div className="space-y-3">
                {profile.future_goals.map((goal, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Goal Description</label>
                      <input
                        type="text"
                        value={goal.description}
                        onChange={(e) => handleGoalChange(idx, 'description', e.target.value)}
                        placeholder="e.g. Daughter's College Abroad"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                      {errors[`goal_desc_${idx}`] && <p className="text-[10px] text-rose-500">{errors[`goal_desc_${idx}`]}</p>}
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Estimated Future Outlay (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="50000"
                        value={goal.estimated_amount}
                        onChange={(e) => handleGoalChange(idx, 'estimated_amount', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                      <span className="text-[10px] text-teal-600 font-medium">{formatINR(goal.estimated_amount)}</span>
                      {errors[`goal_amt_${idx}`] && <p className="text-[10px] text-rose-500">{errors[`goal_amt_${idx}`]}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target (Years)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={goal.target_years}
                        onChange={(e) => handleGoalChange(idx, 'target_years', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                      {errors[`goal_years_${idx}`] && <p className="text-[10px] text-rose-500">{errors[`goal_years_${idx}`]}</p>}
                    </div>

                    <div className="sm:col-span-1 flex justify-end pt-4 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: Preferences & Budget */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>4. Protection Preference & Premium Budget</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Protection Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Protection Philosophy
                </label>
                <select
                  value={profile.protection_preference}
                  onChange={(e) => setProfile({ ...profile, protection_preference: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="pure_protection">Pure Protection (Highest sum assured / Term)</option>
                  <option value="protection_and_wealth">Protection + Wealth Accumulation (ULIP / Endowment)</option>
                </select>
              </div>

              {/* Annual Budget */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Annual Premium Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={profile.preferred_annual_premium_budget || ''}
                  onChange={(e) => setProfile({ ...profile, preferred_annual_premium_budget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-500">{formatINR(profile.preferred_annual_premium_budget)}/year budget</span>
              </div>

              {/* Desired Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desired Policy Duration (Years)
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={profile.desired_policy_duration}
                  onChange={(e) => setProfile({ ...profile, desired_policy_duration: parseInt(e.target.value) || 30 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-500">Covers till age {profile.age + profile.desired_policy_duration}</span>
              </div>

            </div>
          </div>

          {/* ADVANCED ACTUARIAL SETTINGS ACCORDION */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Actuarial Assumptions (Discount Rate & Discounting Mode)</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in text-xs">
                
                {/* Discount Rate */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Real Discount Rate: {(profile.discount_rate * 100).toFixed(1)}% p.a.
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.005"
                    value={profile.discount_rate}
                    onChange={(e) => setProfile({ ...profile, discount_rate: parseFloat(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">Real rate net of inflation (default 6.0%)</span>
                </div>

                {/* Use Discounting Toggle */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Valuation Method
                  </label>
                  <select
                    value={profile.use_discounting ? 'discounted' : 'undiscounted'}
                    onChange={(e) => setProfile({ ...profile, use_discounting: e.target.value === 'discounted' })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="discounted">Discounted Present Value (Recommended)</option>
                    <option value="undiscounted">Undiscounted Nominal Cash Outlays</option>
                  </select>
                </div>

                {/* Retirement Age */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assumed Retirement Age (HLV)
                  </label>
                  <input
                    type="number"
                    min="45"
                    max="75"
                    value={profile.assumed_retirement_age}
                    onChange={(e) => setProfile({ ...profile, assumed_retirement_age: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <span className="text-[10px] text-slate-500">{profile.assumed_retirement_age - profile.age} working years left</span>
                </div>

              </div>
            )}
          </div>

          {/* Form Submit Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Inputs preserved across all stages. No spam or marketing contact.</span>
            </div>

            <button
              type="submit"
              id="submit-stage1-btn"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Net Needs...</span>
                </>
              ) : (
                <>
                  <span>Calculate Coverage Need</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
