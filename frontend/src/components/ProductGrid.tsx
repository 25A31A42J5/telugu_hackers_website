import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, TrendingUp, BarChart3, Layers, CheckCircle2,
  Sliders, AlertCircle, RefreshCw, Star, ChevronRight
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface ProductGridProps {
  onSelectProduct: (category: string) => void;
}

interface ProductCardData {
  id: string;
  category: 'term' | 'whole_life' | 'ulip' | 'endowment';
  label: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  colorDark: string;
  benefits: string[];
  minSA: number;
  maxSA: number;
  minTenure: number;
  maxTenure: number;
  baseRatePer1000: number; // annual
  suitedFor: string;
  tag?: string;
}

const PRODUCTS: ProductCardData[] = [
  {
    id: 'term',
    category: 'term',
    label: 'Term Life Insurance',
    tagline: 'Maximum protection at the lowest cost',
    icon: ShieldCheck,
    color: 'emerald',
    colorDark: '#10B981',
    benefits: [
      'Pure death benefit — 100% goes to family',
      'Lowest premium per lakh of cover',
      'Flexible tenure: 10 to 40 years',
      'Critical illness riders available',
    ],
    minSA: 2500000,
    maxSA: 50000000,
    minTenure: 10,
    maxTenure: 40,
    baseRatePer1000: 0.62,
    suitedFor: 'Income replacement & liability coverage',
    tag: 'Most Popular',
  },
  {
    id: 'whole_life',
    category: 'whole_life',
    label: 'Whole Life Insurance',
    tagline: 'Lifetime cover + guaranteed cash value',
    icon: Layers,
    color: 'blue',
    colorDark: '#3B82F6',
    benefits: [
      'Coverage for entire lifetime (till 99-100)',
      'Guaranteed cash value accumulation',
      'Paid-up value even on premium default',
      'Estate planning & wealth transfer',
    ],
    minSA: 1000000,
    maxSA: 25000000,
    minTenure: 20,
    maxTenure: 40,
    baseRatePer1000: 2.2,
    suitedFor: 'Long-term wealth transfer goals',
  },
  {
    id: 'ulip',
    category: 'ulip',
    label: 'ULIP',
    tagline: 'Market-linked growth + life protection',
    icon: TrendingUp,
    color: 'purple',
    colorDark: '#8B5CF6',
    benefits: [
      'Equity / debt / balanced fund options',
      'Tax-free maturity under Section 10(10D)',
      'Fund switching with zero exit load',
      'Premium redirection allowed anytime',
    ],
    minSA: 1000000,
    maxSA: 20000000,
    minTenure: 5,
    maxTenure: 30,
    baseRatePer1000: 1.8,
    suitedFor: 'Wealth creation with cover (balanced risk)',
  },
  {
    id: 'endowment',
    category: 'endowment',
    label: 'Endowment Plan',
    tagline: 'Guaranteed maturity + life protection',
    icon: BarChart3,
    color: 'amber',
    colorDark: '#F59E0B',
    benefits: [
      'Guaranteed maturity benefit on survival',
      'Bonus additions grow corpus over time',
      'Low risk — not market linked',
      'Loan against policy available',
    ],
    minSA: 500000,
    maxSA: 15000000,
    minTenure: 10,
    maxTenure: 30,
    baseRatePer1000: 3.5,
    suitedFor: 'Goal-based savings with insurance',
  },
];

const COLOR_CONFIG: Record<string, {
  badge: string; badgeBg: string; badgeBorder: string;
  iconBg: string; iconBorder: string; iconText: string;
  btnBg: string; ring: string; starColor: string;
  sliderTrack: string;
}> = {
  emerald: {
    badge: 'text-emerald-700', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200',
    iconBg: 'bg-emerald-50', iconBorder: 'border-emerald-200', iconText: 'text-emerald-600',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700',
    ring: 'ring-emerald-400',
    starColor: 'text-emerald-500',
    sliderTrack: '#10B981',
  },
  blue: {
    badge: 'text-blue-700', badgeBg: 'bg-blue-50', badgeBorder: 'border-blue-200',
    iconBg: 'bg-blue-50', iconBorder: 'border-blue-200', iconText: 'text-blue-600',
    btnBg: 'bg-blue-600 hover:bg-blue-700',
    ring: 'ring-blue-400',
    starColor: 'text-blue-500',
    sliderTrack: '#3B82F6',
  },
  purple: {
    badge: 'text-purple-700', badgeBg: 'bg-purple-50', badgeBorder: 'border-purple-200',
    iconBg: 'bg-purple-50', iconBorder: 'border-purple-200', iconText: 'text-purple-600',
    btnBg: 'bg-purple-600 hover:bg-purple-700',
    ring: 'ring-purple-400',
    starColor: 'text-purple-500',
    sliderTrack: '#8B5CF6',
  },
  amber: {
    badge: 'text-amber-700', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200',
    iconBg: 'bg-amber-50', iconBorder: 'border-amber-200', iconText: 'text-amber-600',
    btnBg: 'bg-amber-600 hover:bg-amber-700',
    ring: 'ring-amber-400',
    starColor: 'text-amber-500',
    sliderTrack: '#F59E0B',
  },
};

const FILTERS = [
  { id: 'all', label: 'All Products' },
  { id: 'term', label: 'Term Insurance' },
  { id: 'whole_life', label: 'Whole Life' },
  { id: 'ulip', label: 'ULIPs' },
  { id: 'endowment', label: 'Endowment' },
];

interface CardState {
  sumAssured: number;
  tenure: number;
}

function calcPremium(product: ProductCardData, sa: number, tenure: number): { annual: number; monthly: number } {
  const annual = (sa / 1000) * product.baseRatePer1000 * (1 + (tenure - 20) * 0.01);
  return { annual: Math.max(annual, 2400), monthly: Math.max(annual / 12, 200) };
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const [filter, setFilter] = useState<string>('all');
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(() =>
    Object.fromEntries(PRODUCTS.map(p => [
      p.id,
      { sumAssured: Math.round((p.minSA + p.maxSA) / 2 / 500000) * 500000, tenure: Math.round((p.minTenure + p.maxTenure) / 2) }
    ]))
  );

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  const updateCard = (id: string, field: 'sumAssured' | 'tenure', val: number) => {
    setCardStates(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: val }
    }));
  };

  return (
    <section id="products" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Sliders className="w-3.5 h-3.5" />
            Tailored Product Matcher
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Find the Right Plan. <span className="text-gradient-emerald">Adjust Live.</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base">
            Move the sliders to model your own policy scenario. Premiums update in real time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border ${
                filter === f.id
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const state = cardStates[product.id];
            const premium = calcPremium(product, state.sumAssured, state.tenure);
            const cc = COLOR_CONFIG[product.color];
            const Icon = product.icon;

            return (
              <div
                key={product.id}
                className="finanza-card flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl ${cc.iconBg} border ${cc.iconBorder} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${cc.iconText}`} />
                    </div>
                    {product.tag && (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cc.badgeBg} ${cc.badge} border ${cc.badgeBorder}`}>
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">{product.label}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{product.tagline}</p>
                </div>

                {/* Benefits */}
                <div className="p-4 flex-1">
                  <ul className="space-y-2 mb-4">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${cc.iconText}`} />
                        <span className="text-xs text-slate-600 leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Sliders */}
                  <div className="space-y-4 mt-4 pt-4 border-t border-slate-100">
                    {/* Sum Assured Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Sum Assured</span>
                        <span className="text-[12px] font-black text-slate-900">{formatINR(state.sumAssured)}</span>
                      </div>
                      <input
                        type="range"
                        min={product.minSA}
                        max={product.maxSA}
                        step={500000}
                        value={state.sumAssured}
                        onChange={e => updateCard(product.id, 'sumAssured', Number(e.target.value))}
                        style={{ accentColor: product.colorDark }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>{formatINR(product.minSA)}</span>
                        <span>{formatINR(product.maxSA)}</span>
                      </div>
                    </div>

                    {/* Tenure Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Policy Tenure</span>
                        <span className="text-[12px] font-black text-slate-900">{state.tenure} Years</span>
                      </div>
                      <input
                        type="range"
                        min={product.minTenure}
                        max={product.maxTenure}
                        step={1}
                        value={state.tenure}
                        onChange={e => updateCard(product.id, 'tenure', Number(e.target.value))}
                        style={{ accentColor: product.colorDark }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>{product.minTenure}Y</span>
                        <span>{product.maxTenure}Y</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Output */}
                  <div className={`mt-4 p-3 rounded-xl ${cc.badgeBg} border ${cc.badgeBorder}`}>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Est. Premium</p>
                    <div className="flex items-end gap-3">
                      <div>
                        <span className={`text-2xl font-black ${cc.badge}`}>
                          {formatINR(Math.round(premium.monthly))}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">/month</span>
                      </div>
                      <div className="text-xs text-slate-500 pb-0.5">
                        {formatINR(Math.round(premium.annual))}/yr
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Indicative · subject to underwriting
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectProduct(product.category)}
                    className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 ${cc.btnBg}`}
                  >
                    Get Full Analysis
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Premium estimates use IRDAI benchmark filing rates. Actual premiums depend on medical history and insurer's underwriting.
          </p>
        </div>
      </div>
    </section>
  );
};
