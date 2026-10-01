import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const db = await connectDB();
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const results: any[] = [];

  const [products, orders, customers, categories] = await Promise.all([
    db.collection('products').find({
      $or: [{ name: regex }, { sku: regex }, { categoryLabel: regex }],
      status: { $ne: 'archived' },
      isDeleted: { $ne: true },
    }).limit(5).toArray(),
    db.collection('orders').find({
      $or: [{ id: regex }, { customerName: regex }, { email: regex }],
    }).limit(4).toArray(),
    db.collection('customers').find({
      $or: [{ name: regex }, { email: regex }, { phone: regex }],
    }).limit(3).toArray(),
    db.collection('categories').find({
      $or: [{ name: regex }, { slug: regex }],
    }).limit(3).toArray(),
  ]);

  products.forEach(p => {
    results.push({
      type: 'product',
      title: p.name,
      subtitle: `SKU: ${p.sku} • ₹${p.price} • ${p.category}`,
      url: `/admin/products/${p.id}/edit`,
      image: p.images?.[0] || '/images/collection-necklaces.jpg',
    });
  });

  orders.forEach(o => {
    results.push({
      type: 'order',
      title: `Order ${o.id}`,
      subtitle: `${o.customerName} • ₹${o.amount} • ${(o.status || '').toUpperCase()}`,
      url: `/admin/orders/${encodeURIComponent(o.id.replace('#', ''))}`,
    });
  });

  customers.forEach(c => {
    results.push({
      type: 'customer',
      title: c.name,
      subtitle: `${c.email} • ${c.ordersCount || 0} orders • ₹${c.totalSpend || 0}`,
      url: `/admin/customers/${c.id}`,
    });
  });

  categories.forEach(c => {
    results.push({
      type: 'category',
      title: c.name,
      subtitle: `Category • ${c.slug}`,
      url: '/admin/categories',
    });
  });

  return NextResponse.json({ results });
}
