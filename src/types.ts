export type Category = 'Grocery' | 'Dairy' | 'Snacks' | 'Personal Care' | 'Beverages' | 'Household';

export type StockHealth = 'CRITICAL' | 'LOW' | 'HEALTHY' | 'EXCESS';

export type SalesPerformance = 'HIGH DEMAND' | 'STEADY' | 'SLOW MOVING' | 'STAGNANT';

export type RestockPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'MONITOR' | 'NORMAL';

export type RecommendationType = 'RESTOCK NOW' | 'RESTOCK SOON' | 'MONITOR' | 'HEALTHY';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // in INR ₹
  currentStock: number;
  reorderLevel: number;
  unitsSold: number;
  revenue: number;
  lastRestocked?: string;
  shelfLifeDays?: number;
  rating?: number;
}

export interface ProductAnalysis {
  product: Product;
  stockHealth: StockHealth;
  salesPerformance: SalesPerformance;
  restockPriority: RestockPriority;
  recommendationType: RecommendationType;
  recommendationText: string;
  recommendedOrderQty: number;
  daysOfInventoryLeft: number;
  stockoutRiskPercent: number;
}

export interface SmartRecommendation {
  id: string;
  productId: string;
  productName: string;
  category: Category;
  type: RecommendationType;
  priorityBadge: '🔴 RESTOCK NOW' | '🟠 RESTOCK SOON' | '🟡 MONITOR' | '🟢 NORMAL';
  currentStock: number;
  reorderLevel: number;
  unitsSold: number;
  revenue: number;
  reason: string;
  actionText: 'RESTOCK' | 'ORDER STOCK' | 'MONITOR' | 'OPTIMIZE PRICE';
  recommendedQty: number;
  estimatedImpact: string;
}

export interface StoreAlert {
  id: string;
  type: 'critical' | 'high' | 'warning' | 'info';
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface RestockRequest {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  recommendedQuantity: number;
  orderQuantity: number;
  priority: RestockPriority;
  supplier: string;
  estimatedCost: number;
  createdAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED';
}

export interface DailySalesData {
  day: string;
  shortDay: string;
  revenue: number;
  units: number;
  orders: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  text: string;
  structuredData?: {
    recommendations?: {
      priority: 'URGENT' | 'HIGH' | 'MEDIUM';
      productName: string;
      stock: number;
      unitsSold: number;
      reorderLevel: number;
      actionText: string;
      productId: string;
    }[];
    actionableProductId?: string;
    kpiSummary?: {
      title: string;
      value: string;
    }[];
  };
}

export type ActiveTab = 'overview' | 'inventory' | 'sales' | 'recommendations' | 'copilot';
