import React, { useState } from 'react';
import {
  ShieldCheck, Mail, Phone, MapPin, ArrowRight, Send, CheckCircle2, Sparkles
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const QUICK_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'Needs Calculator', id: 'calculator' },
  { label: 'Insurance Products', id: 'products' },
  { label: 'Why Choose Us', id: 'why-us' },
  { label: 'Book Advisory', id: 'advisory' },
];

const POLICY_CATEGORIES = [
  'Term Life Insurance',
  'Whole Life Insurance',
  'Unit Linked (ULIP)',
  'Endowment Plans',
  'Critical Illness Riders',
  'Child Education Plans',
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#060C17] text-slate-400 text-sm border-t border-white/6">

      {/* Pre-footer CTA band */}
      <div
        className="relative overflow-hidden py-14"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E2D45 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI Frontier Challenge 2026 — BFSI Track
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to Discover Your True Coverage Gap?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join thousands of families who made smarter insurance decisions with transparent, math-backed guidance.
          </p>
          <button
            onClick={() => onNavigate('calculator')}
            className="btn-emerald inline-flex items-center gap-2.5 px-8 py-4 text-base cursor-pointer"
          >
            Start Free Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onNavigate('hero')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-[2px]">
                <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-extrabold text-lg leading-tight">Insurance Mantra</p>
                <p className="text-[10px] text-slate-500 font-medium">BFSI Track · Telugu Hackers</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Understand Your Needs. Compare Your Options. Protect Your Future. Transparent actuarial guidance for every Indian family.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-xs text-slate-500 mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                123 Finance Way, Hyderabad, TS
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Support: +91 800-MANTRA
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                hello@insurancemantra.in
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {[
                { name: 'LinkedIn', href: '#', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
                { name: 'Twitter', href: '#', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                { name: 'YouTube', href: '#', path: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17 M10 15l5-3-5-3v6z' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  title={item.name}
                  className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Policy Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Policy Categories</h4>
            <ul className="space-y-3">
              {POLICY_CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Get IRDAI updates, coverage tips, and premium alerts delivered weekly.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-emerald-300 text-sm font-semibold">You're subscribed!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="btn-emerald w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
            )}

            {/* BFSI Challenge badge */}
            <div className="mt-6 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Frontier Challenge 2026
              </div>
              <p className="text-slate-500 text-xs leading-snug">
                Proudly built by <strong className="text-white">Telugu Hackers</strong> for the BFSI Track hackathon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>
            © 2026 <strong className="text-slate-400">Insurance Mantra</strong> · Telugu Hackers · All rights reserved.
          </p>
          <p className="text-center max-w-2xl leading-relaxed">
            <strong>Disclaimer:</strong> An educational financial decision support application. All calculations are illustrative simulations based on IRDAI-aligned actuarial benchmarks. Not a licensed insurance broker.
          </p>
        </div>
      </div>
    </footer>
  );
};
