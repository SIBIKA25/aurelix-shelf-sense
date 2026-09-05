import React, { useState } from 'react';
import { Bell, Search, Check, AlertTriangle, ShieldAlert, Sparkles, Store, ChevronDown } from 'lucide-react';
import { StoreAlert } from '../types';
import { STORE_METADATA } from '../data/mockData';

interface HeaderProps {
  alerts: StoreAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onSelectProduct: (productId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenDemoFlow: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  onAcknowledgeAlert,
  searchQuery,
  onSearchChange,
  onOpenDemoFlow
}) => {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="sticky top-0 z-30 glass backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3 text-white flex items-center justify-between gap-4 bg-slate-950/40">
      {/* Store Branding */}
      <div className="flex items-center gap-3 min-w-max">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-extrabold tracking-tight">
          <span className="text-base font-black text-slate-950">IQ</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">{STORE_METADATA.name}</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full status-normal">
              Live Store #104
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">{STORE_METADATA.branch}</p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search inventory, products, categories (e.g., Oil, Rice, Dairy)..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/40 transition-all backdrop-blur-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Hackathon Guide, Alerts, Manager Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Hackathon Demo Flow Quick Launcher */}
        <button
          onClick={onOpenDemoFlow}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 glass glass-hover text-teal-300 hover:text-teal-200 rounded-xl text-xs font-semibold transition-all border border-teal-500/30"
          title="Interactive Hackathon Script Step-by-Step"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Demo Story Flow</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="relative w-10 h-10 glass glass-hover rounded-full flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-all"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
            )}
          </button>

          {/* Alerts Dropdown Panel */}
          {showAlertsMenu && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-white/15">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <h2 className="font-semibold text-sm text-white">Store Alerts Panel</h2>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 font-medium">
                  {unreadAlerts.length} Active
                </span>
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No alerts at this moment</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        alert.acknowledged
                          ? 'bg-white/5 border-white/5 text-slate-400 opacity-60'
                          : alert.type === 'critical'
                          ? 'status-urgent'
                          : alert.type === 'high'
                          ? 'status-warning'
                          : 'bg-amber-500/15 border-amber-500/25 text-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {alert.type === 'critical' && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                          {alert.type === 'high' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                          {alert.type === 'warning' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                          <span>{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="mt-1 leading-relaxed">{alert.message}</p>
                      
                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[10px] text-slate-400">
                          {alert.acknowledged ? 'Status: Acknowledged' : 'Requires Manager Review'}
                        </span>
                        {!alert.acknowledged && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors border border-white/15 cursor-pointer"
                          >
                            <Check className="w-3 h-3 text-teal-400" />
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Manager Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center justify-center shadow-inner">
            {STORE_METADATA.manager.avatar}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{STORE_METADATA.manager.name}</p>
            <p className="text-[11px] text-slate-400 leading-tight opacity-70">{STORE_METADATA.manager.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
