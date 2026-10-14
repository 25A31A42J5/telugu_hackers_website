import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';

interface CounterItemProps {
  value: string;
  numericValue: number;
  suffix: string;
  prefix: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  visible: boolean;
  delay: number;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

const CounterItem: React.FC<CounterItemProps> = ({
  numericValue, prefix, suffix, label, sub, icon: Icon, visible, delay
}) => {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!visible || startedRef.current) return;
    startedRef.current = true;

    const timer = setTimeout(() => {
      const duration = 2000;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        const eased = easeOutQuart(elapsed);
        setDisplay(Math.round(eased * numericValue * 10) / 10);
        if (elapsed < 1) requestAnimationFrame(tick);
        else setDisplay(numericValue);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [visible, numericValue, delay]);

  const formatted = numericValue % 1 !== 0
    ? display.toFixed(1)
    : Math.round(display).toLocaleString('en-IN');

  return (
    <div
      className={`flex flex-col items-center text-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
        <Icon className="w-7 h-7 text-emerald-400" />
      </div>
      <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
        <span className="text-emerald-400">{prefix}</span>
        {formatted}
        <span className="text-emerald-400">{suffix}</span>
      </div>
      <div className="text-sm font-bold text-white/80 mt-0.5">{label}</div>
      <div className="text-xs text-slate-400 mt-1 max-w-[140px]">{sub}</div>
    </div>
  );
};

const STATS = [
  {
    prefix: '₹',
    numericValue: 500,
    suffix: ' Cr+',
    label: 'Coverage Recommended',
    sub: 'Across 50,000+ assessments',
    icon: TrendingUp,
  },
  {
    prefix: '',
    numericValue: 50000,
    suffix: '+',
    label: 'Lives Protected',
    sub: 'Families secured with right coverage',
    icon: Users,
  },
  {
    prefix: '',
    numericValue: 99.2,
    suffix: '%',
    label: 'Claim Settlement Support',
    sub: 'Industry-leading assistance rate',
    icon: ShieldCheck,
  },
  {
    prefix: '',
    numericValue: 4.9,
    suffix: '/5',
    label: 'Customer Advisory Rating',
    sub: 'From verified client reviews',
    icon: Award,
  },
];

export const StatsCounter: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative overflow-hidden py-20"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E2D45 50%, #0F172A 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Impact Metrics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Trusted by Thousands Across India
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            Real numbers. Transparent methodology. Powered by IRDAI-aligned actuarial benchmarks.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <CounterItem
              key={i}
              {...stat}
              value={`${stat.prefix}${stat.numericValue}${stat.suffix}`}
              visible={visible}
              delay={i * 150}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-[12px] text-slate-500">
            * Metrics are illustrative simulations for demonstration. Premium estimates aligned with IRDAI-filed benchmark data.
          </p>
        </div>
      </div>
    </section>
  );
};
