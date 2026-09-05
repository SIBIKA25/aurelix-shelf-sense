/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RestockModal } from './components/RestockModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Toast, ToastMessage } from './components/Toast';
import { HackathonDemoBar, DEMO_STEPS } from './components/HackathonDemoBar';

import { OverviewDashboard } from './views/OverviewDashboard';
import { InventoryView } from './views/InventoryView';
import { SalesAnalyticsView } from './views/SalesAnalyticsView';
import { RecommendationsView } from './views/RecommendationsView';
import { CopilotView } from './views/CopilotView';

import { INITIAL_PRODUCTS, INITIAL_ALERTS, WEEKLY_SALES_TREND } from './data/mockData';
import { Product, StoreAlert, ActiveTab, RestockPriority, RestockRequest } from './types';
import { generateSmartRecommendations } from './utils/analysisEngine';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [alerts, setAlerts] = useState<StoreAlert[]>(INITIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForRestock, setSelectedProductForRestock] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Restock orders ledger
  const [restockOrders, setRestockOrders] = useState<RestockRequest[]>([]);

  // Hackathon demo tour controller
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoBarOpen, setIsDemoBarOpen] = useState<boolean>(true);

  const addToast = (message: string, type: 'success' | 'warning' | 'info' = 'success', title?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    addToast('Alert acknowledged by store manager.', 'info');
  };

  const handleConfirmRestock = (
    productId: string,
    quantity: number,
    priority: RestockPriority,
    supplier: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    // Create record
    const newOrder: RestockRequest = {
      id: `po-${Date.now()}`,
      productId,
      productName: prod.name,
      currentStock: prod.currentStock,
      recommendedQuantity: quantity,
      orderQuantity: quantity,
      priority,
      supplier,
      estimatedCost: Math.round(quantity * (prod.price * 0.75)),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    };

    setRestockOrders((prev) => [newOrder, ...prev]);

    // Update stock to reflect replenished order on the way
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            currentStock: p.currentStock + quantity
          };
        }
        return p;
      })
    );

    // Exact prompt required success notification
    addToast('Restock request created successfully.', 'success', 'PO Requisition Confirmed');
  };

  // Hackathon Demo Workflow execution
  const executeDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);

    const oil = products.find((p) => p.name.toLowerCase().includes('oil')) || products[0];

    switch (stepNumber) {
      case 1:
        // Manager opens dashboard
        setActiveTab('overview');
        addToast('Step 1: Dashboard loaded with sales KPIs & Today\'s Priorities', 'info');
        break;
      case 2:
        // Manager opens inventory
        setActiveTab('inventory');
        addToast('Step 2: Viewing complete inventory management ledger', 'info');
        break;
      case 3:
        // Manager clicks Cooking Oil
        setActiveTab('inventory');
        setSelectedProductForDetail(oil);
        addToast('Step 3: Cooking Oil drilldown (5 units remaining, 110 sold, RESTOCK NOW)', 'info');
        break;
      case 4:
        // Manager opens AI Copilot
        setSelectedProductForDetail(null);
        setActiveTab('copilot');
        addToast('Step 4: AI Copilot ready for restocking questions', 'info');
        break;
      case 5:
        // Manager clicks Create Restock Request
        setSelectedProductForDetail(null);
        setSelectedProductForRestock(oil);
        addToast('Step 5: Review recommended restock order for Cooking Oil', 'info');
        break;
      default:
        break;
    }
  };

  const handleResetDemo = () => {
    setProducts(INITIAL_PRODUCTS);
    setAlerts(INITIAL_ALERTS);
    setDemoStep(1);
    setActiveTab('overview');
    addToast('Demo scenario reset to initial state.', 'info');
  };

  // Calculations for sidebar badges
  const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel && p.currentStock > 0).length;
  const recommendationsCount = generateSmartRecommendations(products).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Frosted Glass Mesh Background */}
      <div className="mesh-bg fixed inset-0 pointer-events-none z-0" />

      {/* Top Header */}
      <div className="relative z-30">
        <Header
          alerts={alerts}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onSelectProduct={(id) => {
            const p = products.find((prod) => prod.id === id);
            if (p) setSelectedProductForDetail(p);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenDemoFlow={() => setIsDemoBarOpen((prev) => !prev)}
        />
      </div>

      {/* Hackathon Demo Flow Banner (Expandable/Dismissible) */}
      <div className="relative z-20">
        <HackathonDemoBar
          currentStep={demoStep}
          isOpen={isDemoBarOpen}
          onClose={() => setIsDemoBarOpen(false)}
          onExecuteStep={executeDemoStep}
          onResetDemo={handleResetDemo}
        />
      </div>

      {/* Main Layout: Left Sidebar + Content Area */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto overflow-hidden relative z-10">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          lowStockCount={lowStockCount}
          recommendationCount={recommendationsCount}
        />

        {/* Dynamic Content View Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTab === 'overview' && (
            <OverviewDashboard
              products={products}
              salesTrends={WEEKLY_SALES_TREND}
              onNavigateTab={setActiveTab}
              onSelectProduct={(p) => setSelectedProductForDetail(p)}
              onOpenRestock={(p) => setSelectedProductForRestock(p)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onSelectProduct={(p) => setSelectedProductForDetail(p)}
              onOpenRestock={(p) => setSelectedProductForRestock(p)}
              externalSearch={searchQuery}
            />
          )}

          {activeTab === 'sales' && (
            <SalesAnalyticsView
              products={products}
              salesTrends={WEEKLY_SALES_TREND}
              onSelectProduct={(p) => setSelectedProductForDetail(p)}
              onOpenRestock={(p) => setSelectedProductForRestock(p)}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsView
              products={products}
              onSelectProduct={(p) => setSelectedProductForDetail(p)}
              onOpenRestock={(p) => setSelectedProductForRestock(p)}
            />
          )}

          {activeTab === 'copilot' && (
            <CopilotView
              products={products}
              onOpenRestock={(p) => setSelectedProductForRestock(p)}
              onSelectProduct={(p) => setSelectedProductForDetail(p)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onRequestRestock={(p) => {
          setSelectedProductForDetail(null);
          setSelectedProductForRestock(p);
        }}
      />

      <RestockModal
        product={selectedProductForRestock}
        isOpen={Boolean(selectedProductForRestock)}
        onClose={() => setSelectedProductForRestock(null)}
        onConfirmRestock={handleConfirmRestock}
      />

      {/* Feedback Toasts */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
