import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d';

    const db = await connectDB();

    // Query collections in parallel
    const [products, orders, customers, categories, settingsDoc] = await Promise.all([
      db.collection('products').find({ isDeleted: { $ne: true } }).toArray(),
      db.collection('orders').find({}).toArray(),
      db.collection('customers').find({}).toArray(),
      db.collection('categories').find({ status: 'active' }).toArray(),
      db.collection('settings').findOne({}),
    ]);

    const defaultLowStockThreshold = settingsDoc?.defaultLowStockThreshold || 5;

    // Product Metrics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.lowStockThreshold || defaultLowStockThreshold));
    const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);

    // Order Metrics
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const refundedOrders = orders.filter(o => o.status === 'refunded' || o.paymentStatus === 'refunded').length;

    // Customer Metrics
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter(c => (c.ordersCount || 0) > 1).length;
    const repeatCustomerRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 1000) / 10 : 0;

    // Eligible Revenue Orders (exclude cancelled and refunded orders)
    const eligibleOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded' && o.paymentStatus !== 'refunded');
    const totalRevenue = eligibleOrders.reduce((sum, o) => sum + (o.amount || o.total || 0), 0);
    const averageOrderValue = eligibleOrders.length > 0 ? Math.round(totalRevenue / eligibleOrders.length) : 0;

    // Time-based Chart and Growth Calculation
    const now = new Date();
    let numDays = 7;
    if (range === '30d') numDays = 30;
    else if (range === '90d') numDays = 90;
    else if (range === '12m') numDays = 365;

    // Current period vs previous period timestamps
    const periodStart = new Date(now.getTime() - numDays * 24 * 60 * 60 * 1000);
    const prevPeriodStart = new Date(now.getTime() - 2 * numDays * 24 * 60 * 60 * 1000);

    let currentPeriodRevenue = 0;
    let prevPeriodRevenue = 0;
    let currentPeriodOrders = 0;
    let prevPeriodOrders = 0;

    eligibleOrders.forEach(o => {
      const orderDate = new Date(o.createdAt || o.date || 0);
      if (orderDate >= periodStart && orderDate <= now) {
        currentPeriodRevenue += (o.amount || o.total || 0);
        currentPeriodOrders += 1;
      } else if (orderDate >= prevPeriodStart && orderDate < periodStart) {
        prevPeriodRevenue += (o.amount || o.total || 0);
        prevPeriodOrders += 1;
      }
    });

    // Dynamic Growth: only compute percentage if historical data exists
    const revenueGrowth = prevPeriodRevenue > 0
      ? `${currentPeriodRevenue >= prevPeriodRevenue ? '+' : ''}${Math.round(((currentPeriodRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100)}%`
      : null;

    const ordersGrowth = prevPeriodOrders > 0
      ? `${currentPeriodOrders >= prevPeriodOrders ? '+' : ''}${Math.round(((currentPeriodOrders - prevPeriodOrders) / prevPeriodOrders) * 100)}%`
      : null;

    // Generate Chart Days
    const chartDaysMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    const displayDays = Math.min(numDays, 30); // Max 30 points on line chart for readability

    for (let i = displayDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      chartDaysMap[key] = { date: key, revenue: 0, orders: 0 };
    }

    eligibleOrders.forEach(o => {
      if (o.createdAt || o.date) {
        const d = new Date(o.createdAt || o.date);
        const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (chartDaysMap[key]) {
          chartDaysMap[key].revenue += (o.amount || o.total || 0);
          chartDaysMap[key].orders += 1;
        }
      }
    });

    const chartDays = Object.values(chartDaysMap);

    // Top Categories based on actual product catalog & orders
    const categoryCounts: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const topCategories = categories
      .map(c => {
        const count = categoryCounts[c.slug] || 0;
        const share = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
        return {
          name: c.name,
          slug: c.slug,
          image: c.image || '/images/collection-necklaces.jpg',
          productCount: count,
          revenueShare: share,
        };
      })
      .filter(c => c.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5);

    // Recent Orders (Real from MongoDB, sorted by createdAt)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6)
      .map(o => {
        const { _id, ...rest } = o;
        return {
          ...rest,
          id: rest.id || _id?.toString(),
        };
      });

    // Real Low Stock Items from MongoDB
    const lowStockList = lowStockProducts.slice(0, 6).map(p => ({
      id: p.id || (p._id as any)?.toString(),
      name: p.name,
      sku: p.sku || 'MK-GEN',
      stock: p.stock || 0,
      image: (typeof p.images?.[0] === 'string' ? p.images[0] : (p.images?.[0] as any)?.url) || '/images/collection-earrings.jpg',
    }));

    return NextResponse.json({
      kpis: {
        totalRevenue,
        revenueGrowth, // null if insufficient historical data
        totalOrders,
        ordersGrowth,  // null if insufficient historical data
        totalCustomers,
        customersGrowth: null,
        totalProducts,
        productsGrowth: null,
        activeProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        pendingOrders: pendingOrders + processingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        refundedOrders,
        averageOrderValue,
        repeatCustomerRate,
      },
      chartDays,
      topCategories,
      recentOrders,
      lowStockList,
    });
  } catch (err: any) {
    console.error('[Admin Analytics Error]:', err?.message);
    return NextResponse.json({ error: err.message || 'Analytics failed' }, { status: 500 });
  }
}
