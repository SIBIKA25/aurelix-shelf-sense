import React from 'react';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Sparkles,
  Bot,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lowStockCount: number;
  recommendationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  lowStockCount,
  recommendationCount
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Store pulse & priorities'
    },
    {
      id: 'inventory' as ActiveTab,
      label: 'Inventory',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Stock levels & reordering'
    },
    {
      id: 'sales' as ActiveTab,
      label: 'Sales Analytics',
      icon: TrendingUp,
      description: 'Trends & best sellers'
    },
    {
      id: 'recommendations' as ActiveTab,
      label: 'Smart Recommendations',
      icon: Sparkles,
      badge: recommendationCount > 0 ? `${recommendationCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Rule-based restocking AI'
    },
    {
      id: 'copilot' as ActiveTab,
      label: 'AI Copilot',
      icon: Bot,
      isAi: true,
      description: 'Conversational assistant'
    }
  ];

  return (
    <aside className="w-full md:w-64 glass backdrop-blur-xl border-r border-white/10 flex flex-col justify-between flex-shrink-0 bg-slate-950/30">
      <div className="p-4">
        {/* Brand Subtitle Card */}
        <div className="px-3 py-2.5 mb-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-teal-400">Retail Copilot</p>
              <p className="text-xs font-semibold text-slate-200">Manager Terminal</p>
            </div>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" title="System Online" />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'sidebar-item-active shadow-sm font-semibold'
                    : 'text-slate-300/80 hover:text-white glass-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-teal-300 bg-teal-500/20'
                        : item.isAi
                        ? 'text-teal-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className={isActive ? 'text-white' : 'text-slate-300'}>{item.label}</span>
                      {item.isAi && !isActive && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                          AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.badgeColor.includes('rose')
                          ? 'status-urgent'
                          : item.badgeColor.includes('amber')
                          ? 'status-warning'
                          : 'status-normal'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-teal-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-medium">Data Sync:</span>
            <span className="text-teal-400 font-semibold">Live Mock Engine</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Decision Engine:</span>
            <span className="text-indigo-300">Active (5 Rules)</span>
          </div>
          <p className="text-[10px] text-slate-400/60 pt-1">RetailIQ Store Operations v2.4</p>
        </div>
      </div>
    </aside>
  );
};
