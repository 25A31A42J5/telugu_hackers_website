import React from 'react';
import { UserCheck, PieChart, Layers, CalendarCheck2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onSelectStage: (stage: number) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSelectStage }) => {
  const steps = [
    {
      step: 1,
      title: "Assess Financial Profile",
      desc: "Input income, expenses, liabilities, dependents, and future milestone goals with dynamic validation.",
      icon: UserCheck,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      step: 2,
      title: "Discover Coverage Need",
      desc: "Our Net Needs engine calculates gross liabilities and deducts existing resources to expose the true shortfall.",
      icon: PieChart,
      color: "from-indigo-600 to-teal-600",
      accent: "text-teal-600 bg-teal-50 border-teal-200"
    },
    {
      step: 3,
      title: "Compare & Customize",
      desc: "Filter suitability across Term, Whole Life, Endowment, and ULIPs. Model custom sum assured and tenure with live sliders.",
      icon: Layers,
      color: "from-teal-600 to-emerald-600",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      step: 4,
      title: "Advisory & Booking",
      desc: "Interact with our intelligent digital advisory assistant or schedule a simulated session with a certified specialist.",
      icon: CalendarCheck2,
      color: "from-blue-600 to-teal-500",
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            End-to-End Customer Journey
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Insurance Mantra Protects Your Family
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Four structured stages designed to turn confusing actuarial insurance calculations into transparent, actionable clarity.
          </p>
        </div>

        {/* Horizontal Stepper for Desktop / Vertical on Mobile */}
        <div className="relative">
          
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-teal-200 to-emerald-200 -translate-y-8 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  onClick={() => onSelectStage(item.step)}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                >
                  <div>
                    {/* Step badge and icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {item.step}
                      </span>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.accent}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    <span>Launch Stage {item.step}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
