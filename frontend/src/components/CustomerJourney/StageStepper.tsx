import React from 'react';
import { UserCheck, PieChart, Layers, CalendarCheck2, Check } from 'lucide-react';

interface StageStepperProps {
  currentStage: number;
  completedStages: number[];
  onSelectStage: (stage: number) => void;
}

export const StageStepper: React.FC<StageStepperProps> = ({
  currentStage,
  completedStages,
  onSelectStage,
}) => {
  const stages = [
    { id: 1, name: 'Step 1', title: 'Assess Profile', icon: UserCheck },
    { id: 2, name: 'Step 2', title: 'Needs Calculation', icon: PieChart },
    { id: 3, name: 'Step 3', title: 'Compare & Customize', icon: Layers },
    { id: 4, name: 'Step 4', title: 'Advisory & Booking', icon: CalendarCheck2 },
  ];

  return (
    <div
      className="w-full py-5 border-b"
      style={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile: progress text */}
        <div className="sm:hidden flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-400">
              {stages[currentStage - 1].name}
            </span>
            <h3 className="text-sm font-bold text-white">
              {stages[currentStage - 1].title}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/6 text-slate-300 border border-white/8">
            {currentStage} / 4
          </span>
        </div>

        {/* Desktop: stepper pills */}
        <div className="grid grid-cols-4 gap-3">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isCurrent = currentStage === stage.id;
            const isCompleted = completedStages.includes(stage.id);
            const isClickable = isCompleted || stage.id <= currentStage;

            return (
              <button
                key={stage.id}
                disabled={!isClickable}
                onClick={() => isClickable && onSelectStage(stage.id)}
                className={`relative flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 ${
                  isCurrent
                    ? 'bg-emerald-500/12 border border-emerald-500/35 shadow-lg shadow-emerald-500/8'
                    : isCompleted
                    ? 'bg-white/4 border border-white/8 hover:bg-white/7 cursor-pointer'
                    : 'bg-white/2 border border-white/5 opacity-45 cursor-not-allowed'
                }`}
              >
                {/* Icon badge */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/6 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <Icon className="w-4.5 h-4.5" />
                  )}
                </div>

                <div className="hidden sm:block min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    isCurrent ? 'text-emerald-400' : isCompleted ? 'text-emerald-600' : 'text-slate-600'
                  }`}>
                    {stage.name}
                  </p>
                  <p className={`text-xs font-bold truncate ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {stage.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
