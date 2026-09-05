import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  AlertOctagon,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Package,
  Calendar,
  Sparkles,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Product, DailySalesData, ActiveTab } from '../types';

interface OverviewDashboardProps {
  products: Product[];
  salesTrends: DailySalesData[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectProduct: (product: Product) => void;
  onOpenRestock: (product: Product) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  products,
  salesTrends,
  onNavigateTab,
  onSelectProduct,
  onOpenRestock
}) => {
  // Calculated or fixed prompt metrics
  const totalRevenueDisplay = '₹1,24,500';
  const unitsSoldDisplay = '2,450';
  const lowStockCount = products.filter(p => p.currentStock <= p.reorderLevel && p.currentStock > 0).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;

  const cookingOil = products.find(p => p.name.toLowerCase().includes('oil')) || products[0];
  const rice = products.find(p => p.name.toLowerCase().includes('rice')) || products[1];
  const biscuits = products.find(p => p.name.toLowerCase().includes('biscuit')) || products[3];

  // Top 5 products by units sold
  const topSellers = [...products]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Store Operations Console</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full status-normal">
              Live Real-Time Sync
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Morning, Manager</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl opacity-80">
            Real-time sales velocity, inventory depletion warnings, and operational recommendations for today's shift.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('copilot')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>Launch AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards Required by Prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="glass p-5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-3">{totalRevenueDisplay}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs previous 7 days</span>
          </div>
        </div>

        {/* Units Sold */}
        <div className="glass p-5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Units Sold</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-3">{unitsSoldDisplay}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
            <span>Consistent store performance</span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="glass p-5 rounded-2xl border border-amber-500/30 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300/90 uppercase tracking-wider">Low Stock Items</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-300 mt-3">{lowStockCount}</p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-amber-300/80 font-medium">Action required</span>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
            >
              Review
            </button>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="glass p-5 rounded-2xl border border-red-500/30 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-300/90 uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-3">{outOfStockCount}</p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-red-300/80 font-medium">Critically low</span>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-red-300 hover:text-red-200 underline font-semibold cursor-pointer"
            >
              Restock
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Trend Chart + Today's Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (Monday to Sunday) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  Weekly Sales Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily revenue (₹) across Monday – Sunday
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                  <span>Gross Revenue</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-teal-300 font-medium">Peak: Saturday (₹23,600)</span>
              </div>
            </div>

            {/* Recharts Chart Container */}
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesTrends}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(2, 6, 23, 0.85)',
                      backdropFilter: 'blur(12px)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '14px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Daily Revenue']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2dd4bf"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>7-Day Store Turnover: <strong className="text-white font-semibold">₹1,24,500</strong></span>
            <button
              onClick={() => onNavigateTab('sales')}
              className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
            >
              <span>Explore Sales Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Today's Priorities Section Required by Prompt */}
        <div className="p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Today's Priorities
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Critical manager action items</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full status-urgent font-bold">
                Action Required
              </span>
            </div>

            {/* Priority Item 1: Oil */}
            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl status-urgent transition-all hover:bg-red-500/25">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
                    🔴 URGENT
                  </span>
                  <span className="text-[11px] text-red-200/90 font-semibold">{cookingOil.currentStock} units left</span>
                </div>
                <p className="text-xs font-bold text-white mt-1">
                  Oil needs immediate restocking.
                </p>
                <p className="text-[11px] text-red-200/80 mt-0.5">
                  Critical runout risk with 110 units sold. Below reorder level (15).
                </p>
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onSelectProduct(cookingOil)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer border border-white/10 transition-colors"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => onOpenRestock(cookingOil)}
                    className="text-[11px] px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Restock
                  </button>
                </div>
              </div>

              {/* Priority Item 2: Rice */}
              <div className="p-3.5 rounded-xl status-warning transition-all hover:bg-amber-500/25">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    🟠 HIGH
                  </span>
                  <span className="text-[11px] text-amber-200/90 font-semibold">{rice.currentStock} units left</span>
                </div>
                <p className="text-xs font-bold text-white mt-1">
                  Rice stock is below reorder level.
                </p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Current stock (8 units) below threshold (20). High demand (120 units sold).
                </p>
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onSelectProduct(rice)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer border border-white/10 transition-colors"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => onOpenRestock(rice)}
                    className="text-[11px] px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Order Stock
                  </button>
                </div>
              </div>

              {/* Priority Item 3: Biscuits */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    🟡 WARNING
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">{biscuits.currentStock} units available</span>
                </div>
                <p className="text-xs font-bold text-white mt-1">
                  Biscuits have unusually high inventory.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  60 units in stock vs 40 units sold. Slow rotation rate.
                </p>
                <div className="mt-2.5 flex items-center justify-end">
                  <button
                    onClick={() => onSelectProduct(biscuits)}
                    className="text-[11px] px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 font-semibold border border-amber-400/30 cursor-pointer transition-colors"
                  >
                    Monitor Inventory
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('recommendations')}
            className="w-full mt-4 py-2.5 text-center text-xs font-bold text-teal-300 hover:text-white glass-hover bg-white/5 border border-white/10 rounded-xl transition-all cursor-pointer"
          >
            View All Smart Recommendations →
          </button>
        </div>
      </div>

      {/* Top Selling Products Section Required by Prompt */}
      <div className="p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-teal-400" />
              Top Selling Products
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Highest volume and margin drivers</p>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold self-start sm:self-auto cursor-pointer"
          >
            Manage Full Inventory ({products.length} items) →
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Units Sold</th>
                <th className="px-4 py-3">Gross Revenue</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topSellers.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => onSelectProduct(item)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-teal-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">Reorder Level: {item.reorderLevel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">{item.category}</td>
                  <td className="px-4 py-3.5 font-medium text-teal-300">₹{item.price}</td>
                  <td className="px-4 py-3.5 font-bold text-white font-mono">{item.unitsSold} units</td>
                  <td className="px-4 py-3.5 font-semibold text-amber-300">₹{item.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.currentStock <= 5
                          ? 'status-urgent'
                          : item.currentStock <= item.reorderLevel
                          ? 'status-warning'
                          : 'status-normal'
                      }`}
                    >
                      {item.currentStock} in stock
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenRestock(item)}
                      className="px-3 py-1 bg-white/10 hover:bg-teal-500 hover:text-slate-950 text-slate-200 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border border-white/10"
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
