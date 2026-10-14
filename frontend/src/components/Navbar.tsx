import React, { useState, useEffect } from 'react';
import {
  MapPin, Phone, Clock, ChevronDown, ShieldCheck, Menu, X, ArrowRight, Sparkles
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onStartAssessment: () => void;
  activeSection: string;
}

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'calculator', label: 'Needs Calculator' },
  { id: 'products', label: 'Insurance Products' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'advisory', label: 'Book Advisory' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onStartAssessment, activeSection }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── TOP UTILITY BAR ── */}
      <div className="topbar-bg hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          {/* Left: contact info */}
          <div className="flex items-center gap-6 text-[12px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              123 Finance Way, Hyderabad
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-400" />
              Support: +91 800-MANTRA
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-emerald-400" />
              Mon – Sat: 9:00 AM – 8:00 PM
            </span>
          </div>
          {/* Right: social links */}
          <div className="flex items-center gap-3">
            {[
              { name: 'LinkedIn', href: '#', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
              { name: 'Twitter', href: '#', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
              { name: 'YouTube', href: '#', path: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17 M10 15l5-3-5-3v6z' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                title={item.name}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0F172A]/98 backdrop-blur-md shadow-xl shadow-black/20'
            : 'bg-[#0F172A]'
        } border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* Brand */}
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl" />
                <div className="absolute inset-[2px] bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-[18px] font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors leading-tight">
                  Insurance Mantra
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Intelligent Advisory Platform
                </div>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-200 cursor-pointer ${
                    activeSection === link.id
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/6'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Telugu Hackers badge */}
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-semibold">
                <Sparkles className="w-3 h-3" />
                Telugu Hackers
              </div>

              <button
                id="nav-cta"
                onClick={onStartAssessment}
                className="btn-emerald hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-[13px] cursor-pointer"
              >
                <span>Calculate Coverage Gap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white/8 transition-colors cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/8 bg-[#0F172A] px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === link.id
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/6'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { onStartAssessment(); setMobileOpen(false); }}
              className="btn-emerald w-full text-center py-3 mt-2 cursor-pointer"
            >
              Calculate Coverage Gap
            </button>
          </div>
        )}
      </header>
    </>
  );
};
