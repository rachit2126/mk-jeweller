import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbOrder } from '@/lib/db/types';
import { getCurrentUser, getCurrentAdmin } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orders
 * Returns orders for the authenticated user or all orders if admin.
 */
export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const user = await getCurrentUser();

    if (!user && !admin) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const db = await connectDB();
    const ordersCol = db.collection('orders');

    let query: any = {};
    if (!admin) {
      // Regular customer: only show their own orders
      query = {
        $or: [
          { customerId: user!.userId },
          { email: user!.email.toLowerCase() },
          { 'customer.email': user!.email.toLowerCase() },
        ],
      };
    } else {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search')?.toLowerCase().trim() || '';
      const status = searchParams.get('status')?.toLowerCase().trim() || '';

      if (search) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = [
          { id: regex },
          { customerName: regex },
          { email: regex },
          { phone: regex },
        ];
      }

      if (status && status !== 'all') {
        query.status = status;
      }
    }

    const docs = await ordersCol.find(query).sort({ createdAt: -1 }).toArray();
    const orders = docs.map((o: any) => {
      const { _id, ...rest } = o;
      return { ...rest, id: rest.id || _id?.toString() } as DbOrder;
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('[Orders API GET Error]:', error?.message);
    return NextResponse.json({ error: 'Unable to retrieve orders.' }, { status: 500 });
  }
}

/**
 * POST /api/orders
 * Creates an order directly in MongoDB.
 * Decrements stock safely from MongoDB products collection.
 * Updates customer spending metrics in MongoDB customers collection.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getCurrentUser();

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item.' }, { status: 400 });
    }

    const db = await connectDB();
    const productsCol = db.collection('products');
    const ordersCol = db.collection('orders');
    const customersCol = db.collection('customers');

    // 1. Validate & Safely Decrement Stock
    for (const item of data.items) {
      const pId = item.productId || item.id;
      if (pId) {
        const product = await productsCol.findOne({
          $or: [{ id: pId }, { slug: pId }],
        });

        if (product) {
          const qty = Number(item.quantity) || 1;
          // Decrement stock without going below 0
          const newStock = Math.max(0, (product.stock || 0) - qty);
          const newStatus = newStock === 0 ? 'out_of_stock' : product.status;
          await productsCol.updateOne(
            { _id: product._id },
            {
              $set: {
                stock: newStock,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              },
            }
          );
        }
      }
    }

    // 2. Generate unique order ID
    const count = await ordersCol.countDocuments();
    const orderNumber = `#MK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: any = {
      orderNumber,
      id: orderNumber,
      customerId: session?.userId || data.customerId || `guest-${Date.now()}`,
      customerName: data.customerName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Patron',
      email: (data.email || session?.email || '').toLowerCase().trim(),
      phone: data.phone || '',
      items: data.items.map((it: any) => ({
        productId: it.productId || it.id,
        name: it.name || 'Fine Silver Jewellery',
        sku: it.sku || `MK-${(it.category || 'JEW').toUpperCase().slice(0, 3)}`,
        image: it.image || '/images/products/placeholder.jpg',
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        total: (Number(it.price) || 0) * (Number(it.quantity) || 1),
      })),
      subtotal: Number(data.subtotal) || Number(data.cartSubtotal) || 0,
      discount: Number(data.discount) || 0,
      tax: Number(data.tax) || 0,
      shipping: Number(data.shipping) || Number(data.shippingFee) || 0,
      amount: Number(data.amount) || Number(data.cartTotal) || 0,
      paymentStatus: data.paymentStatus || 'paid',
      paymentMethod: data.paymentMethod || 'Online / UPI',
      status: 'processing',
      shippingAddress: data.shippingAddress || {
        addressLine: data.address || data.addressLine || 'Jaipur',
        city: data.city || 'Jaipur',
        state: data.state || 'Rajasthan',
        postalCode: data.pincode || data.postalCode || '302001',
        country: 'India',
      },
      timeline: [
        {
          status: 'Order Placed',
          note: 'Customer successfully placed order with 100% MongoDB persistence',
          timestamp: new Date().toISOString(),
        },
      ],
      notes: data.notes || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const insertResult = await ordersCol.insertOne(newOrder as any);

    // 3. Update or Insert Customer Profile in MongoDB
    if (newOrder.email) {
      await customersCol.updateOne(
        { email: newOrder.email },
        {
          $inc: { ordersCount: 1, totalSpend: newOrder.amount },
          $set: {
            name: newOrder.customerName,
            phone: newOrder.phone,
            lastOrderDate: new Date().toISOString().slice(0, 10),
            status: 'active',
            updatedAt: new Date().toISOString(),
          },
          $setOnInsert: {
            id: session?.userId || `cust-${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      order: { ...newOrder, _id: insertResult.insertedId.toString() },
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Orders API POST Error]:', error?.message);
    return NextResponse.json({ error: error?.message || 'Unable to place order.' }, { status: 500 });
  }
}
