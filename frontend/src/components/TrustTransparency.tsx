import React from 'react';
import { ShieldCheck, Scale, Cpu, Eye, AlertCircle, FileText } from 'lucide-react';

export const TrustTransparency: React.FC = () => {
  return (
    <section id="trust" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Methodology & Ethical Standards
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trust & Mathematical Transparency
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Life insurance is a long-term commitment. We believe every calculation formula, assumption, and recommendation criterion must be completely open to inspection.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Net Needs Approach</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              We calculate family income replacement (discounted annuity), future milestone goals (present value), and debt repayment. We never use arbitrary rules-of-thumb like simply multiplying income by 10.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Deductions Safeguard</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              We subtract your existing life policies and earmarked assets exactly once. This guarantees that your calculated coverage requirement represents the true, uninflated shortfall.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Deterministic Matching</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Product recommendations follow strict, verifiable eligibility rules, age brackets, budget constraints, and risk scores. We never allow AI language models to fabricate policy quotes or eligibility rules.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Data Privacy & Minimal Data</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              We never collect government identity documents (Aadhaar/PAN), banking passwords, or payment cards. Data is utilized strictly for mathematical simulation and session advisory.
            </p>
          </div>

        </div>

        {/* Transparent Formula Callout Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Documented Net Needs Calculation Formula</h4>
                <p className="text-xs text-slate-500">Mathematical Specification for BFSI Track Evaluation</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              IRDAI Benchmark Aligned
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono space-y-2">
              <p className="font-bold text-slate-900 font-sans text-sm mb-1">1. Gross Family Protection Need (G):</p>
              <p className="text-blue-700 font-semibold">G = L + PV(Annual Support, n, r) + ∑ PV(Goal_i, t_i, r) + O</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 font-sans">
                <li><strong>L:</strong> Outstanding loans and debt obligations</li>
                <li><strong>PV(Support):</strong> Discounted income replacement: <code>Expenses × [1 - (1+r)^(-n)] / r</code></li>
                <li><strong>PV(Goals):</strong> Present value of milestone goals: <code>Amount / (1+r)^t</code></li>
                <li><strong>O:</strong> Other obligations (emergency reserve, medical buffer)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono space-y-2">
              <p className="font-bold text-slate-900 font-sans text-sm mb-1">2. Estimated Additional Life Cover (C):</p>
              <p className="text-teal-700 font-semibold">C = Max(0, G - (Existing_Life_Cover + Dedicated_Assets))</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 font-sans">
                <li>Existing cover and family assets are subtracted once</li>
                <li>If deductions ≥ Gross Need, C becomes 0 (floor at zero)</li>
                <li><strong>r:</strong> Configurable real discount rate (default 6.0% p.a.)</li>
                <li>Toggleable to undiscounted nominal evaluation at user preference</li>
              </ul>
            </div>
          </div>

          {/* Legal / Regulatory Disclaimer */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Regulatory & Educational Notice:</strong> Insurance Mantra is a decision-support and educational prototype built for the AI Frontier Challenge 2026. Coverage estimates and premium quotations shown are illustrative based on public actuarial benchmarks and do not constitute an official insurance policy contract, solicitation, or binding underwriting offer. Life insurance is subject to medical underwriting and insurer acceptance.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
