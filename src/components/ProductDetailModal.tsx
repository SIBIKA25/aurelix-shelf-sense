import React from 'react';
import { X, Package, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { Product } from '../types';
import { analyzeProduct } from '../utils/analysisEngine';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestRestock: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onRequestRestock
}) => {
  if (!isOpen || !product) return null;

  const analysis = analyzeProduct(product);

  const getStockHealthBadge = (health: string) => {
    switch (health) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'LOW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'EXCESS':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getSalesPerformanceBadge = (perf: string) => {
    switch (perf) {
      case 'HIGH DEMAND':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'STEADY':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'SLOW MOVING':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-600 text-white animate-pulse';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-amber-500 text-slate-900';
      case 'MONITOR':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="glass border border-white/15 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div>
            <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">Product Intelligence Drilldown</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-slate-200 max-h-[80vh] overflow-y-auto">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Current Stock</span>
              <p className={`text-xl font-bold mt-1 font-mono ${product.currentStock <= 5 ? 'text-red-400' : 'text-white'}`}>
                {product.currentStock} <span className="text-xs font-normal text-slate-400">units</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Reorder Level</span>
              <p className="text-xl font-bold text-white mt-1 font-mono">
                {product.reorderLevel} <span className="text-xs font-normal text-slate-400">threshold</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Price</span>
              <p className="text-xl font-bold text-teal-300 mt-1">₹{product.price}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Units Sold</span>
              <p className="text-xl font-bold text-sky-300 mt-1 font-mono">
                {product.unitsSold} <span className="text-xs font-normal text-slate-400">sold</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Revenue</span>
              <p className="text-xl font-bold text-amber-300 mt-1">₹{product.revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Category</span>
              <p className="text-sm font-semibold text-slate-300 mt-2">{product.category}</p>
            </div>
          </div>

          {/* AI Calculated Indicators (Calculated live) */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Calculation Indicators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stock Health */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Stock Health</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStockHealthBadge(analysis.stockHealth)}`}>
                  {analysis.stockHealth}
                </span>
              </div>

              {/* Sales Performance */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Sales Performance</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getSalesPerformanceBadge(analysis.salesPerformance)}`}>
                  {analysis.salesPerformance}
                </span>
              </div>

              {/* Restock Priority */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Restock Priority</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(analysis.restockPriority)}`}>
                  {analysis.restockPriority}
                </span>
              </div>
            </div>
          </div>

          {/* Copilot Recommendation Box */}
          <div className="p-4 rounded-xl glass border border-teal-500/30 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2 text-teal-300">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Copilot Recommendation</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed italic">
              "{analysis.recommendationText}"
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>Estimated run-out time: <strong className="text-amber-300">~{analysis.daysOfInventoryLeft} days</strong></span>
              <span>Stockout risk index: <strong className="text-red-300">{analysis.stockoutRiskPercent}%</strong></span>
            </div>
          </div>
        </div>

        {/* Footer with Action */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.03] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close Drilldown
          </button>

          <button
            onClick={() => {
              onClose();
              onRequestRestock(product);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-98 cursor-pointer"
          >
            <Package className="w-4 h-4" />
            Create Restock Request
          </button>
        </div>
      </div>
    </div>
  );
};
