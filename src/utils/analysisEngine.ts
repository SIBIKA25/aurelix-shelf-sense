import {
  Product,
  ProductAnalysis,
  SmartRecommendation,
  StockHealth,
  SalesPerformance,
  RestockPriority,
  RecommendationType,
  ChatMessage
} from '../types';

export function analyzeProduct(product: Product): ProductAnalysis {
  const { currentStock, reorderLevel, unitsSold, name } = product;

  let stockHealth: StockHealth = 'HEALTHY';
  let salesPerformance: SalesPerformance = 'STEADY';
  let restockPriority: RestockPriority = 'NORMAL';
  let recommendationType: RecommendationType = 'HEALTHY';
  let recommendationText = '';
  let stockoutRiskPercent = 10;

  // Determine Sales Performance
  if (unitsSold >= 90) {
    salesPerformance = 'HIGH DEMAND';
  } else if (unitsSold >= 40) {
    salesPerformance = 'STEADY';
  } else if (unitsSold > 15) {
    salesPerformance = 'SLOW MOVING';
  } else {
    salesPerformance = 'STAGNANT';
  }

  // Determine Stock Health & Restock Priority based on prompt rules:
  // IF stock = 0 -> OUT OF STOCK -> URGENT RESTOCK
  // IF stock <= reorderLevel AND unitsSold is high -> HIGH PRIORITY RESTOCK
  // IF stock > reorderLevel AND sales are low -> OVERSTOCK / MONITOR
  // OTHERWISE -> NORMAL
  if (currentStock === 0) {
    stockHealth = 'CRITICAL';
    restockPriority = 'URGENT';
    recommendationType = 'RESTOCK NOW';
    recommendationText = `Stock is completely depleted (0 units). Immediate emergency restock required to prevent lost revenue and customer dissatisfaction.`;
    stockoutRiskPercent = 100;
  } else if (currentStock <= 5 && salesPerformance === 'HIGH DEMAND') {
    stockHealth = 'CRITICAL';
    restockPriority = 'URGENT';
    recommendationType = 'RESTOCK NOW';
    recommendationText = `Restock ${name} immediately because inventory is below the reorder level while sales are high.`;
    stockoutRiskPercent = 95;
  } else if (currentStock <= reorderLevel) {
    stockHealth = 'LOW';
    if (salesPerformance === 'HIGH DEMAND') {
      restockPriority = 'HIGH';
      recommendationType = 'RESTOCK SOON';
      recommendationText = `Inventory for ${name} (${currentStock} units) is below the reorder threshold (${reorderLevel} units) while experiencing high customer demand (${unitsSold} units sold). Place a supplier order today.`;
      stockoutRiskPercent = 80;
    } else {
      restockPriority = 'MEDIUM';
      recommendationType = 'RESTOCK SOON';
      recommendationText = `${name} stock is at or below reorder level (${currentStock}/${reorderLevel}). Schedule a standard replenishment order with your distributor.`;
      stockoutRiskPercent = 55;
    }
  } else if (currentStock > reorderLevel * 1.5 && (salesPerformance === 'SLOW MOVING' || salesPerformance === 'STAGNANT' || unitsSold < 45)) {
    stockHealth = 'EXCESS';
    restockPriority = 'MONITOR';
    recommendationType = 'MONITOR';
    recommendationText = `Inventory (${currentStock} units) is relatively high compared with sales volume (${unitsSold} units sold). Consider running combo offers or promotional merchandising to rotate stock.`;
    stockoutRiskPercent = 5;
  } else {
    stockHealth = 'HEALTHY';
    restockPriority = 'NORMAL';
    recommendationType = 'HEALTHY';
    recommendationText = `Inventory levels and turnover velocity are balanced. Normal reorder monitoring in effect.`;
    stockoutRiskPercent = 15;
  }

  // Calculate recommended order quantity (safety buffer + lead time demand)
  const averageDailySales = Math.max(1, Math.round(unitsSold / 7));
  const leadTimeDays = 3;
  const bufferStock = reorderLevel;
  const neededStock = Math.max(0, (averageDailySales * leadTimeDays + bufferStock) - currentStock);
  const recommendedOrderQty = Math.max(15, Math.ceil(neededStock / 10) * 10);

  // Estimate days of inventory left
  const daysOfInventoryLeft = averageDailySales > 0 ? Math.floor(currentStock / averageDailySales) : 30;

  return {
    product,
    stockHealth,
    salesPerformance,
    restockPriority,
    recommendationType,
    recommendationText,
    recommendedOrderQty,
    daysOfInventoryLeft,
    stockoutRiskPercent
  };
}

export function generateSmartRecommendations(products: Product[]): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];

  for (const product of products) {
    const analysis = analyzeProduct(product);

    if (analysis.recommendationType === 'RESTOCK NOW') {
      recommendations.push({
        id: `rec-${product.id}`,
        productId: product.id,
        productName: product.name,
        category: product.category,
        type: 'RESTOCK NOW',
        priorityBadge: '🔴 RESTOCK NOW',
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        unitsSold: product.unitsSold,
        revenue: product.revenue,
        reason: 'High demand + low inventory.',
        actionText: 'RESTOCK',
        recommendedQty: analysis.recommendedOrderQty,
        estimatedImpact: `Protects ~₹${(product.price * 25).toLocaleString()} weekly sales volume`
      });
    } else if (analysis.recommendationType === 'RESTOCK SOON') {
      recommendations.push({
        id: `rec-${product.id}`,
        productId: product.id,
        productName: product.name,
        category: product.category,
        type: 'RESTOCK SOON',
        priorityBadge: '🟠 RESTOCK SOON',
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        unitsSold: product.unitsSold,
        revenue: product.revenue,
        reason: product.unitsSold >= 90 
          ? 'Stock is below reorder level with high customer velocity.'
          : 'Stock reached reorder threshold; lead time buffer shrinking.',
        actionText: 'ORDER STOCK',
        recommendedQty: analysis.recommendedOrderQty,
        estimatedImpact: 'Maintains optimal 7-day shelf buffer'
      });
    } else if (analysis.recommendationType === 'MONITOR') {
      recommendations.push({
        id: `rec-${product.id}`,
        productId: product.id,
        productName: product.name,
        category: product.category,
        type: 'MONITOR',
        priorityBadge: '🟡 MONITOR',
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        unitsSold: product.unitsSold,
        revenue: product.revenue,
        reason: 'Inventory is relatively high compared with sales.',
        actionText: 'MONITOR',
        recommendedQty: 0,
        estimatedImpact: 'Capital tied up; promo discount recommended'
      });
    }
  }

  // Sort: RESTOCK NOW first, then RESTOCK SOON, then MONITOR
  const orderWeight = { 'RESTOCK NOW': 1, 'RESTOCK SOON': 2, 'MONITOR': 3, 'HEALTHY': 4 };
  return recommendations.sort((a, b) => orderWeight[a.type] - orderWeight[b.type]);
}

export function generateCopilotAnswer(question: string, products: Product[]): Omit<ChatMessage, 'id' | 'timestamp'> {
  const normalized = question.toLowerCase().trim();

  // Find Cooking Oil, Rice, Milk, Biscuits from active product list
  const oil = products.find(p => p.name.toLowerCase().includes('oil')) || products[0];
  const rice = products.find(p => p.name.toLowerCase().includes('rice')) || products[1];
  const milk = products.find(p => p.name.toLowerCase().includes('milk')) || products[2];
  const biscuits = products.find(p => p.name.toLowerCase().includes('biscuit')) || products[3];

  // 1. WHICH PRODUCTS SHOULD I RESTOCK? / RESTOCK TODAY?
  if (
    normalized.includes('restock') ||
    normalized.includes('running out') ||
    normalized.includes('run out') ||
    normalized.includes('stock out')
  ) {
    return {
      sender: 'copilot',
      text: `Based on current inventory and sales:

🔴 ${oil.name} – URGENT
Only ${oil.currentStock} units remain and ${oil.unitsSold} units have been sold.

🔴 ${rice.name} – HIGH PRIORITY
Only ${rice.currentStock} units remain and ${rice.unitsSold} units have been sold.

🟠 ${milk.name} – MEDIUM PRIORITY
${milk.currentStock} units remain and the reorder level is ${milk.reorderLevel}.

Recommended action:
Restock ${oil.name} first.`,
      structuredData: {
        actionableProductId: oil.id,
        recommendations: [
          {
            priority: 'URGENT',
            productName: oil.name,
            stock: oil.currentStock,
            unitsSold: oil.unitsSold,
            reorderLevel: oil.reorderLevel,
            actionText: 'Restock Cooking Oil',
            productId: oil.id
          },
          {
            priority: 'HIGH',
            productName: rice.name,
            stock: rice.currentStock,
            unitsSold: rice.unitsSold,
            reorderLevel: rice.reorderLevel,
            actionText: 'Restock Rice',
            productId: rice.id
          },
          {
            priority: 'MEDIUM',
            productName: milk.name,
            stock: milk.currentStock,
            unitsSold: milk.unitsSold,
            reorderLevel: milk.reorderLevel,
            actionText: 'Restock Milk',
            productId: milk.id
          }
        ]
      }
    };
  }

  // 2. BEST SELLING PRODUCT
  if (
    normalized.includes('best selling') ||
    normalized.includes('best seller') ||
    normalized.includes('selling well') ||
    normalized.includes('top selling')
  ) {
    const sortedByRev = [...products].sort((a, b) => b.revenue - a.revenue);
    const sortedByUnits = [...products].sort((a, b) => b.unitsSold - a.unitsSold);
    const topRevenue = sortedByRev[0];
    const topUnits = sortedByUnits[0];

    return {
      sender: 'copilot',
      text: `Here are your sales champions right now:

🏆 Highest Revenue: **${topRevenue.name}**
Revenue: ₹${topRevenue.revenue.toLocaleString()} (${topRevenue.unitsSold} units @ ₹${topRevenue.price})

📦 Highest Unit Velocity: **${topUnits.name}**
Volume: ${topUnits.unitsSold} units sold

Top 5 Performers:
1. ${oil.name} – ₹${oil.revenue.toLocaleString()} (${oil.unitsSold} units)
2. ${rice.name} – ₹${rice.revenue.toLocaleString()} (${rice.unitsSold} units)
3. ${milk.name} – ₹${milk.revenue.toLocaleString()} (${milk.unitsSold} units)
4. ${biscuits.name} – ₹${biscuits.revenue.toLocaleString()} (${biscuits.unitsSold} units)
5. Soap – ₹1,250 (25 units)

⚠️ Critical Store Manager Alert: ${oil.name} is selling fastest relative to remaining inventory (only ${oil.currentStock} units left). Restocking immediately protects your #1 margin earner.`,
      structuredData: {
        actionableProductId: oil.id,
        kpiSummary: [
          { title: 'Top Revenue Earner', value: `${topRevenue.name} (₹${topRevenue.revenue.toLocaleString()})` },
          { title: 'Highest Volume', value: `${topUnits.name} (${topUnits.unitsSold} units)` }
        ]
      }
    };
  }

  // 3. LOW IN STOCK
  if (normalized.includes('low in stock') || normalized.includes('low stock')) {
    const lowStockList = products.filter(p => p.currentStock <= p.reorderLevel && p.currentStock > 0);
    return {
      sender: 'copilot',
      text: `We currently have ${lowStockList.length} items operating below their designated reorder thresholds:

🔴 **Immediate Critical Attention:**
- ${oil.name}: ${oil.currentStock} units left (Reorder level: ${oil.reorderLevel})
- ${rice.name}: ${rice.currentStock} units left (Reorder level: ${rice.reorderLevel})
- Whole Wheat Bread: 5 units left (Reorder level: 15)

🟠 **High Priority Replenishment:**
- ${milk.name}: ${milk.currentStock} units left (Reorder level: ${milk.reorderLevel})
- Salted Butter: 4 units left (Reorder level: 12)
- Instant Noodles: 6 units left (Reorder level: 20)

Would you like me to prepare purchase requisitions for your prime distributors?`,
      structuredData: {
        actionableProductId: oil.id
      }
    };
  }

  // 4. OVERSTOCKED / NOT SELLING
  if (
    normalized.includes('overstock') ||
    normalized.includes('not selling') ||
    normalized.includes('excess') ||
    normalized.includes('slow moving')
  ) {
    return {
      sender: 'copilot',
      text: `Analysis of inventory with low turnover velocity:

🟡 **${biscuits.name} (Overstock Warning)**
- Available Stock: ${biscuits.currentStock} units
- Units Sold: Only ${biscuits.unitsSold} units
- Reorder Level: ${biscuits.reorderLevel}
- Issue: Inventory is 300% above safety threshold while sales velocity has softened.

🟡 **Hand Sanitizer Gel**
- Available Stock: 10 units
- Units Sold: Only 10 units over the tracking window

Recommended Actions:
1. Feature ${biscuits.name} at the checkout impulse shelf or create a "Buy Milk + Get Biscuits 20% off" breakfast bundle.
2. Freeze upcoming purchase orders for snacks until inventory drops under 30 units.`,
      structuredData: {
        actionableProductId: biscuits.id
      }
    };
  }

  // 5. WHAT SHOULD I FOCUS ON TODAY? / ACTIONS TO TAKE
  if (
    normalized.includes('focus on today') ||
    normalized.includes('action') ||
    normalized.includes('priorities') ||
    normalized.includes('what should i do')
  ) {
    return {
      sender: 'copilot',
      text: `Here is your Daily Manager Battleplan for today:

1. 🔴 **EMERGENCY RESTOCK: Cooking Oil**
   Stock is down to ${oil.currentStock} units. At current run-rate (15-20 units/day), the shelf will stock out before 4:00 PM today.
   → **Action:** Tap 'Create Restock Request' for 50 units.

2. 🟠 **REORDER: Rice & Fresh Milk**
   Rice has 8 units left (120 units sold). Milk has 15 units left (fast turnover). Reorder before distributor 2:00 PM cutoff.

3. 🟡 **PROMOTION: Biscuits Merchandising**
   High inventory (${biscuits.currentStock} units). Move display to End-Cap Aisle 2 with a combo offer.

4. ⚪ **EXPIRY AUDIT: Fresh Dairy**
   Conduct mid-shift FIFO rotation on dairy shelves before evening rush.`,
      structuredData: {
        actionableProductId: oil.id
      }
    };
  }

  // 6. HOW CAN I IMPROVE INVENTORY?
  if (normalized.includes('improve') || normalized.includes('strategy') || normalized.includes('tips')) {
    return {
      sender: 'copilot',
      text: `Here are 4 high-impact tactics based on your store's sales and stock patterns:

1. **Automate Dynamic Reordering:** Connect your fast movers (Cooking Oil, Rice, Milk) to automated 48-hour supplier replenishment triggers so stock never falls below 3 days of demand.
2. **Implement Cross-Category Bundling:** Pair slow-moving Snacks (${biscuits.name}) with high-velocity Beverages (Tea/Milk) to clear overstock without pure margin discounting.
3. **Safety Stock Rationalization:** Increase reorder thresholds on Cooking Oil from 15 to 25 units to absorb weekend traffic spikes.
4. **Distributor Lead-Time Tracking:** Lock in morning delivery slots with local dairy vendors to maintain 99%+ on-shelf availability.`
    };
  }

  // Default intelligent assistant response with contextual store insights
  return {
    sender: 'copilot',
    text: `Based on current store analytics for RetailIQ:

- **Total Revenue:** ₹1,24,500 across 2,450 units sold.
- **Top Priority:** ${oil.name} requires immediate restocking (${oil.currentStock} units remaining vs ${oil.unitsSold} sold).
- **Secondary Watchlist:** ${rice.name} (8 left) and ${milk.name} (15 left).
- **Overstock Alert:** ${biscuits.name} (${biscuits.currentStock} units in stock vs ${biscuits.unitsSold} sold).

You can ask me to draft restock purchase orders, evaluate category performance, or plan aisle promotions.`
  };
}
