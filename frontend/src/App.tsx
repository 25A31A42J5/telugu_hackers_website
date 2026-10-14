import React, { useState, useEffect, useRef } from 'react';
import { CustomerProfile, CalculationResult, ProductRecommendation } from './types';
import { fetchSampleProfile, calculateNeeds, fetchRecommendations } from './services/api';

// ─── New Finanza Layout Components ───
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { StatsCounter } from './components/StatsCounter';
import { AboutSection } from './components/AboutSection';
import { ProductGrid } from './components/ProductGrid';
import { ConsultationScheduler } from './components/ConsultationScheduler';
import { Footer } from './components/Footer';

// ─── Existing Journey Components (preserved) ───
import { StageStepper } from './components/CustomerJourney/StageStepper';
import { Stage1Questionnaire } from './components/CustomerJourney/Stage1Questionnaire';
import { Stage2NeedsCalculator } from './components/CustomerJourney/Stage2NeedsCalculator';
import { Stage3ProductRecommender } from './components/CustomerJourney/Stage3ProductRecommender';
import { Stage4DigitalAdvisory } from './components/CustomerJourney/Stage4DigitalAdvisory';

import { ShieldCheck, Sparkles, ArrowRight, Loader2, X } from 'lucide-react';

// ─── Default demo profile ───
const DEFAULT_PROFILE: CustomerProfile = {
  age: 32,
  employment_category: 'salaried',
  annual_gross_income: 1800000,
  annual_household_expenses: 720000,
  dependents_count: 2,
  years_of_support_needed: 22,
  risk_preference: 'balanced',
  protection_preference: 'pure_protection',
  outstanding_liabilities: 4500000,
  existing_life_insurance: 2500000,
  current_savings: 1600000,
  eligible_assets_for_family: 1000000,
  other_obligations: 500000,
  future_goals: [
    { description: "Child's Higher Education & Overseas College", estimated_amount: 3500000, target_years: 15 },
    { description: 'Family Healthcare & Parental Emergency Reserve', estimated_amount: 1000000, target_years: 8 },
  ],
  preferred_annual_premium_budget: 35000,
  desired_policy_duration: 30,
  preferred_category: 'term',
  discount_rate: 0.06,
  use_discounting: true,
  assumed_retirement_age: 60,
};

export function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  const [profile, setProfile] = useState<CustomerProfile>(DEFAULT_PROFILE);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const calculatorRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const advisoryRef = useRef<HTMLElement>(null);
  const whyUsRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Initial silent calculation
  useEffect(() => {
    executeCalculation(DEFAULT_PROFILE, false);
  }, []);

  // ── Intersection observer for active section tracking ──
  useEffect(() => {
    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'calculator', ref: calculatorRef },
      { id: 'products', ref: productsRef },
      { id: 'why-us', ref: whyUsRef },
      { id: 'advisory', ref: advisoryRef },
    ];

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) setActiveSection(sectionId);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
  };

  const executeCalculation = async (p: CustomerProfile, advance: boolean = true) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const calcResult = await calculateNeeds(p);
      setCalculation(calcResult);
      const recsResult = await fetchRecommendations(p, calcResult.net_needs.net_additional_life_cover_required);
      setRecommendations(recsResult);
      setCompletedStages(prev => Array.from(new Set([...prev, 1, 2, 3])));
      if (advance) {
        setCurrentStage(2);
        setTimeout(() => scrollToSection('calculator'), 300);
      }
    } catch (err: any) {
      setApiError(err.message || 'Failed to calculate coverage requirements.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    try {
      const sample = await fetchSampleProfile();
      setProfile(sample);
      await executeCalculation(sample, true);
    } catch (err: any) {
      setApiError('Failed to fetch sample profile from API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setCurrentStage(1);
    setTimeout(() => scrollToSection('calculator'), 100);
  };

  const handleSelectProduct = (category: string) => {
    setProfile(prev => ({ ...prev, preferred_category: category }));
    setCurrentStage(3);
    setTimeout(() => scrollToSection('calculator'), 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans overflow-x-hidden">

      {/* ── GLOBAL LOADING OVERLAY ── */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <div className="text-center">
              <p className="font-bold text-slate-900">Calculating Coverage...</p>
              <p className="text-xs text-slate-500 mt-1">Running Net Needs & HLV analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      <Navbar
        onNavigate={handleNavigate}
        onStartAssessment={handleStartAssessment}
        activeSection={activeSection}
      />

      <main className="flex-1">

        {/* 1. HERO CAROUSEL */}
        <section ref={heroRef} data-section="hero">
          <HeroCarousel
            onStartAssessment={handleStartAssessment}
            onExploreProducts={() => handleNavigate('products')}
          />
        </section>

        {/* ─── JUDGE QUICK DEMO BANNER ─── */}
        <div className="bg-amber-50 border-y border-amber-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <strong>Hackathon Judge?</strong> Load a pre-filled Indian household profile for instant demo →
            </div>
            <button
              onClick={handleLoadSample}
              className="btn-gold px-5 py-2 text-sm flex items-center gap-2 cursor-pointer"
            >
              Load Demo Profile (₹18L, Age 32, 2 Dependents)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. STATS COUNTER BAR */}
        <StatsCounter />

        {/* 3. ABOUT / WHY US */}
        <section ref={whyUsRef} data-section="why-us">
          <AboutSection onStartAssessment={handleStartAssessment} />
        </section>

        {/* 4. ── 4-STAGE NEEDS CALCULATOR ── */}
        <section
          id="calculator"
          ref={calculatorRef}
          data-section="calculator"
          className="py-16 bg-white border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Interactive Needs Assessment Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Your 4-Stage Coverage Finder
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
              Follow our actuarial workflow to evaluate protection needs, model policy scenarios, and receive expert guidance.
            </p>
          </div>

          {/* Stepper */}
          <StageStepper
            currentStage={currentStage}
            completedStages={completedStages}
            onSelectStage={(s) => setCurrentStage(s)}
          />

          {/* API Error */}
          {apiError && (
            <div className="max-w-4xl mx-auto mt-6 px-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
                <span><strong>Error:</strong> {apiError}</span>
                <button onClick={() => setApiError(null)} className="cursor-pointer ml-4">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Stage Views */}
          {currentStage === 1 && (
            <Stage1Questionnaire
              initialProfile={profile}
              onSubmit={(p) => { setProfile(p); executeCalculation(p, true); }}
              onLoadSample={handleLoadSample}
              isLoading={isLoading}
            />
          )}

          {currentStage === 2 && calculation && (
            <Stage2NeedsCalculator
              calculation={calculation}
              profile={profile}
              onProceedToRecommendations={() => {
                setCompletedStages(prev => Array.from(new Set([...prev, 2])));
                setCurrentStage(3);
              }}
              onBackToAssessment={() => setCurrentStage(1)}
            />
          )}

          {currentStage === 3 && (
            <Stage3ProductRecommender
              profile={profile}
              recommendations={recommendations}
              calculatedGap={calculation ? calculation.net_needs.net_additional_life_cover_required : 5000000}
              onProceedToAdvisory={() => {
                setCompletedStages(prev => Array.from(new Set([...prev, 3])));
                setCurrentStage(4);
              }}
              onBackToCalculator={() => setCurrentStage(2)}
            />
          )}

          {currentStage === 4 && calculation && (
            <Stage4DigitalAdvisory
              profile={profile}
              calculation={calculation}
              selectedCategory={profile.preferred_category || 'term'}
              onBackToRecommender={() => setCurrentStage(3)}
            />
          )}
        </section>

        {/* 5. PRODUCT GRID WITH LIVE SLIDERS */}
        <section ref={productsRef} data-section="products">
          <ProductGrid onSelectProduct={handleSelectProduct} />
        </section>

        {/* 6. CONSULTATION SCHEDULER */}
        <section ref={advisoryRef} data-section="advisory">
          <ConsultationScheduler
            defaultGap={calculation?.net_needs?.net_additional_life_cover_required}
            defaultCategory={profile.preferred_category || 'term'}
          />
        </section>

      </main>

      {/* ── FOOTER ── */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
