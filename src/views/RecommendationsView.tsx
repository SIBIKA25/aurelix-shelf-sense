import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  ArrowRight,
  Package,
  Clock,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Product, SmartRecommendation, RecommendationType } from '../types';
import { generateSmartRecommendations } from '../utils/analysisEngine';

interface RecommendationsViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenRestock: (product: Product) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  products,
  onSelectProduct,
  onOpenRestock
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  // Generate recommendations using the rule-based engine
  const allRecommendations = useMemo(() => {
    return generateSmartRecommendations(products);
  }, [products]);

  const filteredRecommendations = useMemo(() => {
    if (filterType === 'ALL') return allRecommendations;
    return allRecommendations.filter((r) => r.type === filterType);
  }, [allRecommendations, filterType]);

  const counts = {
    all: allRecommendations.length,
    restockNow: allRecommendations.filter((r) => r.type === 'RESTOCK NOW').length,
    restockSoon: allRecommendations.filter((r) => r.type === 'RESTOCK SOON').length,
    monitor: allRecommendations.filter((r) => r.type === 'MONITOR').length
  };

  const handleActionClick = (rec: SmartRecommendation) => {
    const prod = products.find((p) => p.id === rec.productId);
    if (!prod) return;

    if (rec.actionText === 'RESTOCK' || rec.actionText === 'ORDER STOCK') {
      onOpenRestock(prod);
    } else {
      onSelectProduct(prod);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Rule-Based Inventory Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Smart Recommendations</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 opacity-80">
            Automated recommendations combining real-time on-hand stock and sales turnover velocity.
          </p>
        </div>
      </div>

      {/* Embedded Decision Engine Rules Guide */}
      <div className="glass p-4 rounded-xl border border-white/10 text-xs text-slate-200 space-y-2 backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Cpu className="w-4 h-4 text-teal-400" />
          <span>Active Decision Rules Applied:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-[11px]">
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
            <strong className="text-white">Rule 1:</strong> IF stock = 0 → OUT OF STOCK → Urgent Restock
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <strong className="text-white">Rule 2:</strong> IF stock ≤ reorderLevel & unitsSold is high → High Priority Restock
          </div>
          <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300">
            <strong className="text-white">Rule 3:</strong> IF stock &gt; reorderLevel & sales are low → Overstock / Monitor
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <strong className="text-white">Rule 4:</strong> Balanced velocity & safety stock → Normal
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap border-b border-white/10 pb-3">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterType === 'ALL'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
              : 'glass text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          All Recommendations ({counts.all})
        </button>
        <button
          onClick={() => setFilterType('RESTOCK NOW')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterType === 'RESTOCK NOW'
              ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
              : 'glass text-red-300 hover:text-white border border-red-500/30'
          }`}
        >
          <span>🔴 Restock Now</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold">{counts.restockNow}</span>
        </button>
        <button
          onClick={() => setFilterType('RESTOCK SOON')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterType === 'RESTOCK SOON'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'glass text-amber-300 hover:text-white border border-amber-500/30'
          }`}
        >
          <span>🟠 Restock Soon</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold">{counts.restockSoon}</span>
        </button>
        <button
          onClick={() => setFilterType('MONITOR')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterType === 'MONITOR'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
              : 'glass text-teal-300 hover:text-white border border-teal-500/30'
          }`}
        >
          <span>🟡 Monitor Overstock</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold">{counts.monitor}</span>
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecommendations.map((rec) => {
          const isRestockNow = rec.type === 'RESTOCK NOW';
          const isRestockSoon = rec.type === 'RESTOCK SOON';
          const isMonitor = rec.type === 'MONITOR';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl glass border backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01] ${
                isRestockNow
                  ? 'border-red-500/30 bg-red-500/[0.04]'
                  : isRestockSoon
                  ? 'border-amber-500/30 bg-amber-500/[0.04]'
                  : 'border-teal-500/30 bg-teal-500/[0.04]'
              }`}
            >
              {/* Card Header & Badge */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isRestockNow
                        ? 'status-urgent animate-pulse'
                        : isRestockSoon
                        ? 'status-warning'
                        : 'status-normal'
                    }`}
                  >
                    {rec.priorityBadge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{rec.category}</span>
                </div>

                {/* Product Name */}
                <h3 className="text-xl font-bold text-white mt-3">{rec.productName}</h3>

                {/* Units and Status Callout */}
                <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-slate-400">Inventory Status:</span>
                    <span className={`font-bold font-mono ${isRestockNow ? 'text-red-400' : 'text-slate-200'}`}>
                      {rec.currentStock === 0 ? '0 units remaining' : `Only ${rec.currentStock} units remaining`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-slate-400">Sales Velocity:</span>
                    <span className="font-semibold text-teal-300 font-mono">{rec.unitsSold} units sold</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Reorder Threshold:</span>
                    <span className="font-mono">{rec.reorderLevel} units</span>
                  </div>
                </div>

                {/* Reason */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Trigger Reason:
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                {/* Business Impact Note */}
                <div className="mt-3 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span>Impact: {rec.estimatedImpact}</span>
                </div>
              </div>

              {/* Action Button Required by Prompt */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const prod = products.find((p) => p.id === rec.productId);
                    if (prod) onSelectProduct(prod);
                  }}
                  className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleActionClick(rec)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                    isRestockNow
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30'
                      : isRestockSoon
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                      : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30'
                  }`}
                >
                  <span>{rec.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
