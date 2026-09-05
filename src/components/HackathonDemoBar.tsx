import React from 'react';
import { Sparkles, ChevronRight, CheckCircle2, Play, RotateCcw, X } from 'lucide-react';
import { ActiveTab, Product } from '../types';

export interface DemoStep {
  step: number;
  title: string;
  description: string;
  tab: ActiveTab;
  actionText: string;
}

interface HackathonDemoBarProps {
  currentStep: number;
  isOpen: boolean;
  onClose: () => void;
  onExecuteStep: (stepNumber: number) => void;
  onResetDemo: () => void;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: '1. Store Dashboard & Low-Stock Alerts',
    description: 'Manager reviews KPI cards (₹1,24,500 Revenue, 12 Low Stock, 4 Out of Stock) and Today\'s Priorities.',
    tab: 'overview',
    actionText: 'Open Overview'
  },
  {
    step: 2,
    title: '2. Inventory Management Grid',
    description: 'Manager inspects real-time inventory table, search, category filters, and priority status tags.',
    tab: 'inventory',
    actionText: 'Go to Inventory'
  },
  {
    step: 3,
    title: '3. Cooking Oil Deep Analysis',
    description: 'Drilldown view: 5 units remaining, 110 units sold, reorder level 15. System recommends "RESTOCK NOW".',
    tab: 'inventory',
    actionText: 'Analyze Cooking Oil'
  },
  {
    step: 4,
    title: '4. RetailIQ AI Copilot',
    description: 'Open Copilot and ask: "Which products should I restock today?" to receive real-time analyzed insights.',
    tab: 'copilot',
    actionText: 'Ask Copilot'
  },
  {
    step: 5,
    title: '5. Create Restock Request',
    description: 'Submit formal restock requisition for Cooking Oil and verify instant feedback toast.',
    tab: 'copilot',
    actionText: 'Restock Cooking Oil'
  }
];

export const HackathonDemoBar: React.FC<HackathonDemoBarProps> = ({
  currentStep,
  isOpen,
  onClose,
  onExecuteStep,
  onResetDemo
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass backdrop-blur-xl border-b border-white/10 px-4 py-3 text-white transition-all shadow-xl bg-slate-950/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Hackathon Demo Story</span>
              <span className="text-[10px] bg-white/10 text-teal-200 px-2 py-0.5 rounded-full border border-white/15 font-medium">
                Step {currentStep} of 5
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1">
              {DEMO_STEPS[currentStep - 1]?.description || 'Follow the complete retail decision story.'}
            </p>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {DEMO_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => onExecuteStep(s.step)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === s.step
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : currentStep > s.step
                  ? 'bg-teal-950/40 text-teal-300 border border-teal-700/40 hover:bg-teal-900/50'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white glass-hover'
              }`}
            >
              {currentStep > s.step ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              ) : (
                <span>{s.step}</span>
              )}
              <span className="hidden lg:inline">{s.title.split('.')[1]}</span>
            </button>
          ))}

          {currentStep < 5 ? (
            <button
              onClick={() => onExecuteStep(currentStep + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition-all ml-1 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          ) : (
            <button
              onClick={onResetDemo}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-semibold transition-all ml-1 border border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Flow</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
            title="Dismiss Demo Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
