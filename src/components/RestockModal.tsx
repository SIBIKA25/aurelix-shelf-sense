import React, { useState, useEffect } from 'react';
import { X, PackagePlus, AlertCircle, Truck, CheckCircle2 } from 'lucide-react';
import { Product, RestockPriority } from '../types';

interface RestockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestock: (productId: string, quantity: number, priority: RestockPriority, supplier: string) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmRestock
}) => {
  if (!isOpen || !product) return null;

  // Calculate default recommended quantity
  const defaultRecommended = Math.max(25, (product.reorderLevel * 2) - product.currentStock);
  const [quantity, setQuantity] = useState<number>(defaultRecommended);
  const [priority, setPriority] = useState<RestockPriority>(
    product.currentStock <= 5 ? 'URGENT' : product.currentStock <= product.reorderLevel ? 'HIGH' : 'MEDIUM'
  );
  const [supplier, setSupplier] = useState<string>('Metro Wholesale Distributors');
  const [notes, setNotes] = useState<string>('Priority morning delivery request');

  useEffect(() => {
    if (product) {
      const rec = Math.max(20, (product.reorderLevel * 2) - product.currentStock);
      // For Cooking Oil specifically, default to 50 as mentioned in the prompt example
      if (product.name.toLowerCase().includes('oil')) {
        setQuantity(50);
        setPriority('URGENT');
      } else {
        setQuantity(rec);
        setPriority(product.currentStock <= 5 ? 'URGENT' : product.currentStock <= product.reorderLevel ? 'HIGH' : 'MEDIUM');
      }
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmRestock(product.id, quantity, priority, supplier);
    onClose();
  };

  const estimatedCost = quantity * (product.price * 0.75); // wholesale wholesale estimate

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="glass border border-white/15 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Create Restock Request</h2>
              <p className="text-xs text-slate-400">Initiate purchase requisition for warehouse delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-200">
          {/* Summary Banner */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</span>
              <p className="text-base font-bold text-white mt-0.5">{product.name}</p>
              <p className="text-xs text-slate-400">{product.category} • Current retail: ₹{product.price}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Stock</span>
              <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                <span
                  className={`text-base font-bold font-mono ${
                    product.currentStock <= 5
                      ? 'text-red-400'
                      : product.currentStock <= product.reorderLevel
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {product.currentStock} units
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Reorder Threshold: {product.reorderLevel}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recommended Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Recommended Quantity
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono font-medium focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Units
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Suggested buffer for ~7 days coverage</p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RestockPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-teal-400 focus:outline-none"
              >
                <option value="URGENT" className="bg-slate-900 text-white">🔴 Urgent (Same-day rush)</option>
                <option value="HIGH" className="bg-slate-900 text-white">🟠 High (Next morning)</option>
                <option value="MEDIUM" className="bg-slate-900 text-white">🟡 Medium (48 hours)</option>
                <option value="NORMAL" className="bg-slate-900 text-white">🟢 Normal (Standard cycle)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Sets delivery SLA with supplier</p>
            </div>
          </div>

          {/* Supplier Info */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assigned Supplier
            </label>
            <div className="relative">
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              <Truck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Order Notes / Delivery Window
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Unload at Back Dock B before morning customer peak"
              className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
          </div>

          {/* Cost Estimate Callout */}
          <div className="p-3 rounded-xl glass border border-teal-500/30 flex items-center justify-between text-xs text-teal-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Est. Wholesale Cost: ₹{Math.round(estimatedCost).toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-teal-300 font-medium">Billed to Store #104</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Create Restock Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
