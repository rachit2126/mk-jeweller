import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await connectDB();
  const docs = await db.collection('inventory').find({}).toArray();
  const inventory = docs.map(i => {
    const { _id, ...rest } = i;
    return { ...rest, id: rest.id || _id?.toString() };
  });

  return NextResponse.json({ inventory });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, change, newStock, reason } = await req.json();

    if (!productId || (change === undefined && newStock === undefined)) {
      return NextResponse.json({ error: 'Product ID and stock adjustment are required' }, { status: 400 });
    }

    const db = await connectDB();
    const record = await db.collection('inventory').findOne({ productId });
    const product = await db.collection('products').findOne({ id: productId });

    if (!record || !product) {
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 });
    }

    const prevStock = record.currentStock;
    const finalStock = newStock !== undefined ? Math.max(0, newStock) : Math.max(0, prevStock + change);
    const diff = finalStock - prevStock;
    const availableStock = Math.max(0, finalStock - (record.reservedStock || 0));
    const status = finalStock === 0 ? 'out_of_stock' : finalStock <= (record.lowStockThreshold || 5) ? 'low_stock' : 'in_stock';

    const historyEntry = {
      id: `hist-${Date.now()}`,
      previous: prevStock,
      change: diff,
      new: finalStock,
      reason: reason || 'Manual Admin Stock Adjustment',
      admin: session.name,
      timestamp: new Date().toISOString(),
    };

    await db.collection('inventory').updateOne(
      { productId },
      {
        $set: {
          currentStock: finalStock,
          availableStock,
          status,
          updatedAt: new Date().toISOString(),
        },
        $push: {
          history: {
            $each: [historyEntry],
            $position: 0,
          },
        } as any,
      }
    );

    // Sync to product in MongoDB
    let prodStatus = product.status;
    if (finalStock === 0 && prodStatus === 'active') {
      prodStatus = 'out_of_stock';
    } else if (finalStock > 0 && prodStatus === 'out_of_stock') {
      prodStatus = 'active';
    }

    await db.collection('products').updateOne(
      { id: productId },
      {
        $set: {
          stock: finalStock,
          inStock: finalStock > 0,
          status: prodStatus,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'STOCK_CHANGED',
      resource: 'Inventory',
      resourceId: productId,
      details: `Adjusted stock for "${record.productName}" from ${prevStock} to ${finalStock} (${diff >= 0 ? '+' : ''}${diff}) — ${reason || 'Manual Adjustment'}`,
      timestamp: new Date().toISOString(),
    });

    const updatedRecord = {
      ...record,
      currentStock: finalStock,
      availableStock,
      status,
      history: [historyEntry, ...(record.history || [])],
      updatedAt: new Date().toISOString(),
    };
    delete (updatedRecord as any)._id;

    return NextResponse.json({ success: true, record: updatedRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update stock' }, { status: 500 });
  }
}

