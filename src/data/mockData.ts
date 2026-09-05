import { Product, DailySalesData, StoreAlert } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Cooking Oil',
    category: 'Grocery',
    price: 150,
    currentStock: 5,
    reorderLevel: 15,
    unitsSold: 110,
    revenue: 16500,
    lastRestocked: '4 days ago',
    shelfLifeDays: 180,
    rating: 4.8
  },
  {
    id: 'prod-2',
    name: 'Rice',
    category: 'Grocery',
    price: 50,
    currentStock: 8,
    reorderLevel: 20,
    unitsSold: 120,
    revenue: 6000,
    lastRestocked: '6 days ago',
    shelfLifeDays: 365,
    rating: 4.6
  },
  {
    id: 'prod-3',
    name: 'Milk',
    category: 'Dairy',
    price: 50,
    currentStock: 15,
    reorderLevel: 25,
    unitsSold: 95,
    revenue: 4750,
    lastRestocked: 'Yesterday',
    shelfLifeDays: 4,
    rating: 4.9
  },
  {
    id: 'prod-4',
    name: 'Biscuits',
    category: 'Snacks',
    price: 50,
    currentStock: 60,
    reorderLevel: 20,
    unitsSold: 40,
    revenue: 2000,
    lastRestocked: '2 weeks ago',
    shelfLifeDays: 90,
    rating: 4.3
  },
  {
    id: 'prod-5',
    name: 'Soap',
    category: 'Personal Care',
    price: 50,
    currentStock: 45,
    reorderLevel: 15,
    unitsSold: 25,
    revenue: 1250,
    lastRestocked: '1 week ago',
    shelfLifeDays: 730,
    rating: 4.4
  },
  // Additional low-stock items (Total low stock = 12 items: 1-Cooking Oil, 2-Rice, 3-Milk, 6-14)
  {
    id: 'prod-6',
    name: 'Wheat Flour (Atta 5kg)',
    category: 'Grocery',
    price: 240,
    currentStock: 7,
    reorderLevel: 18,
    unitsSold: 140,
    revenue: 33600,
    lastRestocked: '5 days ago',
    shelfLifeDays: 120,
    rating: 4.7
  },
  {
    id: 'prod-7',
    name: 'Salted Butter (500g)',
    category: 'Dairy',
    price: 260,
    currentStock: 4,
    reorderLevel: 12,
    unitsSold: 65,
    revenue: 16900,
    lastRestocked: '3 days ago',
    shelfLifeDays: 60,
    rating: 4.8
  },
  {
    id: 'prod-8',
    name: 'Instant Noodles (Pack of 4)',
    category: 'Snacks',
    price: 60,
    currentStock: 6,
    reorderLevel: 20,
    unitsSold: 210,
    revenue: 12600,
    lastRestocked: '4 days ago',
    shelfLifeDays: 180,
    rating: 4.5
  },
  {
    id: 'prod-9',
    name: 'Detergent Powder (2kg)',
    category: 'Household',
    price: 190,
    currentStock: 6,
    reorderLevel: 18,
    unitsSold: 55,
    revenue: 10450,
    lastRestocked: '10 days ago',
    shelfLifeDays: 730,
    rating: 4.5
  },
  {
    id: 'prod-10',
    name: 'Herbal Toothpaste',
    category: 'Personal Care',
    price: 85,
    currentStock: 9,
    reorderLevel: 22,
    unitsSold: 70,
    revenue: 5950,
    lastRestocked: '8 days ago',
    shelfLifeDays: 365,
    rating: 4.6
  },
  {
    id: 'prod-11',
    name: 'Whole Wheat Bread',
    category: 'Dairy',
    price: 45,
    currentStock: 5,
    reorderLevel: 15,
    unitsSold: 90,
    revenue: 4050,
    lastRestocked: 'Yesterday',
    shelfLifeDays: 5,
    rating: 4.7
  },
  {
    id: 'prod-12',
    name: 'Premium Tea Powder (500g)',
    category: 'Beverages',
    price: 220,
    currentStock: 8,
    reorderLevel: 16,
    unitsSold: 45,
    revenue: 9900,
    lastRestocked: '6 days ago',
    shelfLifeDays: 365,
    rating: 4.8
  },
  {
    id: 'prod-13',
    name: 'Hand Sanitizer Gel',
    category: 'Personal Care',
    price: 50,
    currentStock: 10,
    reorderLevel: 20,
    unitsSold: 10,
    revenue: 500,
    lastRestocked: '3 weeks ago',
    shelfLifeDays: 730,
    rating: 4.1
  },
  {
    id: 'prod-14',
    name: 'Filter Coffee Powder',
    category: 'Beverages',
    price: 150,
    currentStock: 4,
    reorderLevel: 14,
    unitsSold: 40,
    revenue: 6000,
    lastRestocked: '5 days ago',
    shelfLifeDays: 180,
    rating: 4.9
  },
  // 4 Out of Stock Items (currentStock = 0)
  {
    id: 'prod-15',
    name: 'Organic Almond Milk',
    category: 'Dairy',
    price: 120,
    currentStock: 0,
    reorderLevel: 15,
    unitsSold: 85,
    revenue: 10200,
    lastRestocked: '12 days ago',
    shelfLifeDays: 90,
    rating: 4.9
  },
  {
    id: 'prod-16',
    name: 'Green Tea Detox Pack',
    category: 'Beverages',
    price: 180,
    currentStock: 0,
    reorderLevel: 10,
    unitsSold: 50,
    revenue: 9000,
    lastRestocked: '14 days ago',
    shelfLifeDays: 365,
    rating: 4.6
  },
  {
    id: 'prod-17',
    name: 'Dark Chocolate Bar (70%)',
    category: 'Snacks',
    price: 110,
    currentStock: 0,
    reorderLevel: 20,
    unitsSold: 90,
    revenue: 9900,
    lastRestocked: '9 days ago',
    shelfLifeDays: 180,
    rating: 4.8
  },
  {
    id: 'prod-18',
    name: 'Natural Brown Sugar (1kg)',
    category: 'Grocery',
    price: 75,
    currentStock: 0,
    reorderLevel: 15,
    unitsSold: 60,
    revenue: 4500,
    lastRestocked: '11 days ago',
    shelfLifeDays: 365,
    rating: 4.5
  },
  // Additional healthy volume item to reach the overall 2,450 units sold
  {
    id: 'prod-19',
    name: 'Mineral Water (1L)',
    category: 'Beverages',
    price: 20,
    currentStock: 140,
    reorderLevel: 50,
    unitsSold: 650,
    revenue: 13000,
    lastRestocked: '2 days ago',
    shelfLifeDays: 365,
    rating: 4.6
  },
  {
    id: 'prod-20',
    name: 'Potato Chips Masala',
    category: 'Snacks',
    price: 30,
    currentStock: 85,
    reorderLevel: 30,
    unitsSold: 410,
    revenue: 12300,
    lastRestocked: '3 days ago',
    shelfLifeDays: 90,
    rating: 4.4
  }
];

export const WEEKLY_SALES_TREND: DailySalesData[] = [
  { day: 'Monday', shortDay: 'Mon', revenue: 14200, units: 280, orders: 112 },
  { day: 'Tuesday', shortDay: 'Tue', revenue: 15800, units: 310, orders: 128 },
  { day: 'Wednesday', shortDay: 'Wed', revenue: 13900, units: 275, orders: 115 },
  { day: 'Thursday', shortDay: 'Thu', revenue: 16400, units: 325, orders: 134 },
  { day: 'Friday', shortDay: 'Fri', revenue: 19800, units: 390, orders: 160 },
  { day: 'Saturday', shortDay: 'Sat', revenue: 23600, units: 460, orders: 192 },
  { day: 'Sunday', shortDay: 'Sun', revenue: 20800, units: 410, orders: 174 }
];

export const INITIAL_ALERTS: StoreAlert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'Critically Low Stock',
    message: 'Cooking Oil is critically low (only 5 units remaining). Immediate restock needed.',
    productId: 'prod-1',
    productName: 'Cooking Oil',
    timestamp: '10 mins ago',
    acknowledged: false
  },
  {
    id: 'alert-2',
    type: 'critical',
    title: 'Reorder Level Breached',
    message: 'Rice has reached reorder level (8 units remaining, reorder threshold 20).',
    productId: 'prod-2',
    productName: 'Rice',
    timestamp: '35 mins ago',
    acknowledged: false
  },
  {
    id: 'alert-3',
    type: 'high',
    title: 'Restock Required',
    message: 'Milk requires restocking (15 units remaining, reorder threshold 25). Fast turning inventory.',
    productId: 'prod-3',
    productName: 'Milk',
    timestamp: '1 hour ago',
    acknowledged: false
  },
  {
    id: 'alert-4',
    type: 'warning',
    title: 'Potential Overstock',
    message: 'Biscuits may be overstocked (60 units in stock vs only 40 units sold this period).',
    productId: 'prod-4',
    productName: 'Biscuits',
    timestamp: '3 hours ago',
    acknowledged: false
  }
];

export const STORE_METADATA = {
  name: 'RetailIQ Supermart',
  branch: 'Koramangala 5th Block Store #104',
  city: 'Bengaluru, India',
  manager: {
    name: 'Rajesh Sharma',
    role: 'Store General Manager',
    shift: 'Morning (08:00 - 18:00)',
    avatar: 'RS'
  },
  kpiOverview: {
    totalRevenue: '₹1,24,500',
    revenueGrowth: '+14.2% vs last week',
    unitsSold: '2,450',
    unitsGrowth: '+8.5% volume',
    lowStockItems: 12,
    outOfStockItems: 4,
    avgOrderValue: '₹425',
    bestSeller: 'Cooking Oil (₹16,500)'
  }
};
