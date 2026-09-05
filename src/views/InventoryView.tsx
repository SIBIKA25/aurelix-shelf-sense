import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Package,
  Plus,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Product, Category, StockHealth, RestockPriority } from '../types';
import { analyzeProduct } from '../utils/analysisEngine';

interface InventoryViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenRestock: (product: Product) => void;
  externalSearch?: string;
}

type SortField = 'name' | 'stock' | 'sales' | 'revenue' | 'priority';
type SortDirection = 'asc' | 'desc';

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSelectProduct,
  onOpenRestock,
  externalSearch = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(externalSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Categories present in catalog
  const categories = ['ALL', 'Grocery', 'Dairy', 'Snacks', 'Personal Care', 'Beverages', 'Household'];
  const statuses = ['ALL', 'OUT OF STOCK', 'CRITICAL', 'LOW STOCK', 'HEALTHY', 'OVERSTOCKED'];

  // Priority sort helper
  const priorityWeight: Record<RestockPriority, number> = {
    URGENT: 1,
    HIGH: 2,
    MEDIUM: 3,
    MONITOR: 4,
    NORMAL: 5
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .map(p => ({
        ...p,
        analysis: analyzeProduct(p)
      }))
      .filter(item => {
        // Search query
        const query = (searchQuery || externalSearch).toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.analysis.stockHealth.toLowerCase().includes(query);

        // Category filter
        const matchesCategory =
          selectedCategory === 'ALL' || item.category === selectedCategory;

        // Stock status filter
        let matchesStatus = true;
        if (selectedStatus === 'OUT OF STOCK') {
          matchesStatus = item.currentStock === 0;
        } else if (selectedStatus === 'CRITICAL') {
          matchesStatus = item.analysis.stockHealth === 'CRITICAL' || item.currentStock <= 5;
        } else if (selectedStatus === 'LOW STOCK') {
          matchesStatus = item.currentStock <= item.reorderLevel && item.currentStock > 0;
        } else if (selectedStatus === 'HEALTHY') {
          matchesStatus = item.analysis.stockHealth === 'HEALTHY';
        } else if (selectedStatus === 'OVERSTOCKED') {
          matchesStatus = item.analysis.stockHealth === 'EXCESS' || item.currentStock > item.reorderLevel * 1.5;
        }

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'sales') {
          comp = a.unitsSold - b.unitsSold;
        } else if (sortField === 'stock') {
          comp = a.currentStock - b.currentStock;
        } else if (sortField === 'revenue') {
          comp = a.revenue - b.revenue;
        } else if (sortField === 'priority') {
          comp = priorityWeight[a.analysis.restockPriority] - priorityWeight[b.analysis.restockPriority];
        } else {
          comp = a.name.localeCompare(b.name);
        }

        return sortDirection === 'asc' ? comp : -comp;
      });
  }, [products, searchQuery, externalSearch, selectedCategory, selectedStatus, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'priority' || field === 'stock' ? 'asc' : 'desc');
    }
  };

  const getStockBadge = (stock: number, reorder: number, health: StockHealth) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold status-urgent animate-pulse">
          Out of Stock
        </span>
      );
    }
    if (health === 'CRITICAL' || stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold status-urgent">
          Critical ({stock})
        </span>
      );
    }
    if (stock <= reorder) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold status-warning">
          Low Stock ({stock})
        </span>
      );
    }
    if (health === 'EXCESS') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Overstocked ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold status-normal">
        Healthy ({stock})
      </span>
    );
  };

  const getPriorityBadge = (priority: RestockPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2.5 py-0.5 rounded-full status-urgent text-[11px] font-bold">🔴 Urgent</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full status-warning text-[11px] font-bold">🟠 High</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">🟡 Medium</span>;
      case 'MONITOR':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold">🟣 Monitor</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium">Normal</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Management</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 opacity-80">
            Real-time stock ledger with automated replenishment priority tags and sales velocity metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setSortField('priority');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="p-4 rounded-2xl glass border border-white/10 backdrop-blur-md shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, category, or health..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-400/50 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  Category: {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Stock Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-400/50 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  Status: {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Quick Sorting Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-300">Quick Sort:</span>
            <button
              onClick={() => handleSort('priority')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                sortField === 'priority'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm shadow-teal-400/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('sales')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                sortField === 'sales'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm shadow-teal-400/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              Sort by Sales {sortField === 'sales' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('stock')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                sortField === 'stock'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm shadow-teal-400/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              Sort by Stock {sortField === 'stock' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('revenue')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                sortField === 'revenue'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm shadow-teal-400/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              Revenue {sortField === 'revenue' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} catalog items
          </div>
        </div>
      </div>

      {/* Main Inventory Table with All 10 Required Columns:
          Product | Category | Price | Current Stock | Reorder Level | Units Sold | Revenue | Stock Status | Priority | Action
      */}
      <div className="rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-white/5 text-slate-300 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Product</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('stock')}>
                  <div className="flex items-center gap-1.5">
                    <span>Current Stock</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Reorder Level</th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('sales')}>
                  <div className="flex items-center gap-1.5">
                    <span>Units Sold</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center gap-1.5">
                    <span>Revenue</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Stock Status</th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('priority')}>
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No matching products found</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try adjusting your search terms or filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    {/* Product Name */}
                    <td className="px-4 py-3.5 font-semibold text-white group-hover:text-teal-300 transition-colors">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.name === 'Cooking Oil' && (
                          <span className="text-[9px] px-2 py-0.2 rounded-full status-urgent font-bold">
                            Demo Target
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 text-slate-400">{item.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3.5 font-medium text-teal-300">₹{item.price}</td>

                    {/* Current Stock */}
                    <td className="px-4 py-3.5 font-bold">
                      <span className={item.currentStock <= 5 ? 'text-red-400' : 'text-slate-200'}>
                        {item.currentStock}
                      </span>
                    </td>

                    {/* Reorder Level */}
                    <td className="px-4 py-3.5 text-slate-400">{item.reorderLevel}</td>

                    {/* Units Sold */}
                    <td className="px-4 py-3.5 font-bold font-mono text-slate-200">{item.unitsSold}</td>

                    {/* Revenue */}
                    <td className="px-4 py-3.5 font-semibold text-amber-300">₹{item.revenue.toLocaleString()}</td>

                    {/* Stock Status */}
                    <td className="px-4 py-3.5">
                      {getStockBadge(item.currentStock, item.reorderLevel, item.analysis.stockHealth)}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5">{getPriorityBadge(item.analysis.restockPriority)}</td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectProduct(item)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                          title="Detailed Product Analysis"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenRestock(item)}
                          className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer insight */}
        <div className="px-6 py-3.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-400" />
            <span>Click any product row to open the in-depth Stock Health and Demand Velocity analysis.</span>
          </div>
          <span className="text-[11px] text-slate-400/70 hidden sm:inline">Store #104 Inventory Ledger</span>
        </div>
      </div>
    </div>
  );
};
