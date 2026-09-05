import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Award,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Flame,
  Star,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Product, DailySalesData } from '../types';

interface SalesAnalyticsViewProps {
  products: Product[];
  salesTrends: DailySalesData[];
  onSelectProduct: (product: Product) => void;
  onOpenRestock: (product: Product) => void;
}

export const SalesAnalyticsView: React.FC<SalesAnalyticsViewProps> = ({
  products,
  salesTrends,
  onSelectProduct,
  onOpenRestock
}) => {
  // Aggregate KPI numbers matching prompt
  const totalRevenue = 124500;
  const totalUnits = 2450;
  const avgOrderValue = 425;
  const bestSellerProduct = 'Cooking Oil (₹16,500)';

  // Category sales aggregation
  const categorySalesMap: Record<string, { revenue: number; units: number }> = {};
  products.forEach((p) => {
    if (!categorySalesMap[p.category]) {
      categorySalesMap[p.category] = { revenue: 0, units: 0 };
    }
    categorySalesMap[p.category].revenue += p.revenue;
    categorySalesMap[p.category].units += p.unitsSold;
  });

  const categoryChartData = Object.keys(categorySalesMap).map((cat) => ({
    name: cat,
    revenue: categorySalesMap[cat].revenue,
    units: categorySalesMap[cat].units
  }));

  // Top 5 best sellers matching exact prompt order/specification:
  // 1. Cooking Oil - 110 units
  // 2. Rice - 120 units
  // 3. Milk - 95 units
  // 4. Biscuits - 40 units
  // 5. Soap - 25 units
  const coreTargetNames = ['Cooking Oil', 'Rice', 'Milk', 'Biscuits', 'Soap'];
  const bestSellersList = coreTargetNames
    .map((name) => products.find((p) => p.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Product[];

  // Product sales comparison bar chart data
  const productChartData = bestSellersList.map((p) => ({
    name: p.name,
    unitsSold: p.unitsSold,
    revenue: p.revenue
  }));

  const COLORS = ['#2dd4bf', '#38bdf8', '#fbbf24', '#f472b6', '#a78bfa', '#34d399'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Revenue & Demand Intelligence</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Sales Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 opacity-80">
            Historical sales volume, category revenue contribution, and performance rankings across store inventory.
          </p>
        </div>
      </div>

      {/* 4 Required KPI Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-3">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-xs text-teal-400 font-medium flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs benchmark
          </span>
        </div>

        <div className="glass p-5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Units Sold</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-3">{totalUnits.toLocaleString()}</p>
          <span className="text-xs text-blue-300 font-medium flex items-center gap-1 mt-1">
            Across 20 catalog SKUs
          </span>
        </div>

        <div className="glass p-5 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Value</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-300 mt-3">₹{avgOrderValue}</p>
          <span className="text-xs text-slate-400 font-medium mt-1 block">
            ~3.2 items per customer checkout
          </span>
        </div>

        <div className="glass p-5 rounded-2xl border border-teal-500/30 backdrop-blur-md relative overflow-hidden group glass-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Best Selling Product</span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-3 truncate">{bestSellerProduct}</p>
          <span className="text-xs text-teal-300 font-medium mt-1 block">
            High margin • 110 units sold
          </span>
        </div>
      </div>

      {/* Chart Row 1: Daily Sales Trend & Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Daily Sales (Monday to Sunday) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                Daily Sales Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">7-day gross sales distribution (Monday – Sunday)</p>
            </div>
            <span className="text-xs text-teal-300 font-medium">Daily Revenue</span>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(2, 6, 23, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Sales */}
        <div className="p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-teal-400" />
                Category Sales
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Contribution by store department</p>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(2, 6, 23, 0.85)',
                      backdropFilter: 'blur(12px)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
            {categoryChartData.slice(0, 4).map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 truncate">{cat.name}:</span>
                <span className="text-slate-400 font-medium ml-auto">₹{Math.round(cat.revenue / 1000)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Product Sales Comparison */}
      <div className="p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              Product Sales Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Units sold vs Gross revenue across target products</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-teal-300 font-medium">
              <span className="w-3 h-3 rounded bg-teal-400 inline-block" /> Units Sold
            </span>
            <span className="flex items-center gap-1.5 text-sky-300 font-medium">
              <span className="w-3 h-3 rounded bg-sky-400 inline-block" /> Gross Revenue (₹)
            </span>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(2, 6, 23, 0.85)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              />
              <Bar dataKey="unitsSold" name="Units Sold" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue (₹)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Sellers Table Required by Prompt:
          1. Cooking Oil - 110 units
          2. Rice - 120 units
          3. Milk - 95 units
          4. Biscuits - 40 units
          5. Soap - 25 units
      */}
      <div className="p-6 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Best Sellers Leaderboard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Top-performing products highlighted with velocity metrics</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full status-normal font-semibold">
            Top Velocity
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Rank & Product</th>
                <th className="px-4 py-3">Units Sold</th>
                <th className="px-4 py-3">Gross Revenue</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Stock Remaining</th>
                <th className="px-4 py-3">Status Indicator</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bestSellersList.map((item, idx) => {
                const isChampion = item.name === 'Cooking Oil';
                const isSecond = item.name === 'Rice';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className={`transition-colors cursor-pointer group ${
                      isChampion
                        ? 'bg-amber-500/10 hover:bg-amber-500/15'
                        : isSecond
                        ? 'bg-teal-500/10 hover:bg-teal-500/15'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/40 shadow-sm'
                              : idx === 1
                              ? 'bg-slate-200 text-slate-900'
                              : idx === 2
                              ? 'bg-amber-600 text-white'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-teal-300 transition-colors">
                              {item.name}
                            </span>
                            {isChampion && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full status-warning font-bold">
                                #1 Revenue Driver
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{item.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-bold text-white text-sm font-mono">
                      {item.unitsSold} units
                    </td>

                    <td className="px-4 py-4 font-bold text-amber-300 text-sm">
                      ₹{item.revenue.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 font-medium text-teal-300">
                      ₹{item.price}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`font-bold ${item.currentStock <= 5 ? 'text-red-400' : 'text-slate-200'}`}>
                        {item.currentStock} units
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.currentStock <= 5 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-urgent">
                          Critical Stockout Risk
                        </span>
                      ) : item.currentStock <= item.reorderLevel ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-warning">
                          Below Reorder Level
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold status-normal">
                          Steady Turnover
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenRestock(item)}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
