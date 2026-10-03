import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const statusFilter = searchParams.get('status') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));

    const db = await connectDB();

    // Products collection is the authoritative source of truth
    const prodQuery: any = {
      isDeleted: { $ne: true },
      status: { $ne: 'archived' },
    };

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      prodQuery.$or = [
        { name: regex },
        { sku: regex },
        { slug: regex },
        { category: regex },
        { categoryLabel: regex },
      ];
    }

    const [activeProducts, inventoryDocs] = await Promise.all([
      db.collection('products').find(prodQuery).sort({ createdAt: -1 }).toArray(),
      db.collection('inventory').find({}).toArray(),
    ]);

    // Build fast inventory metadata map (history, custom threshold, reservations)
    const invMap = new Map<string, any>();
    inventoryDocs.forEach((doc: any) => {
      if (doc.productId) invMap.set(doc.productId, doc);
      if (doc.sku) invMap.set(doc.sku, doc);
    });

    // Derive inventory rows strictly from active products
    const derived = activeProducts.map((p: any) => {
      const pId = p.id || (p._id as any)?.toString();
      const invRecord = invMap.get(pId) || invMap.get(p.sku);

      const currentStock = Math.max(0, Number(p.stock) || 0);
      const lowStockThreshold = Number(p.lowStockThreshold) || Number(invRecord?.lowStockThreshold) || 5;
      const reservedStock = Number(p.reservedStock) || Number(invRecord?.reservedStock) || 0;
      const availableStock = Math.max(0, currentStock - reservedStock);

      let status = 'in_stock';
      if (currentStock <= 0) {
        status = 'out_of_stock';
      } else if (currentStock <= lowStockThreshold) {
        status = 'low_stock';
      }

      const image = Array.isArray(p.images) ? (p.images[0] || '/images/products/ring-minimal-silver-01.jpg') : (p.images || '/images/products/ring-minimal-silver-01.jpg');

      return {
        id: invRecord?.id || `inv-${pId}`,
        productId: pId,
        productName: p.name,
        sku: p.sku || 'MK-GEN',
        productImage: image,
        currentStock,
        reservedStock,
        availableStock,
        lowStockThreshold,
        status,
        history: invRecord?.history || [],
        updatedAt: p.updatedAt || invRecord?.updatedAt || new Date().toISOString(),
      };
    });

    // Filter by status if specified
    let filtered = derived;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      inventory: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error: any) {
    console.error('Error fetching admin inventory:', error);
    return NextResponse.json({ error: 'Failed to retrieve inventory from database' }, { status: 500 });
  }
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
    const isObjectId = ObjectId.isValid(productId) && productId.length === 24;
    const productFilter = isObjectId ? { $or: [{ _id: new ObjectId(productId) }, { id: productId }] } : { id: productId };

    const product = await db.collection('products').findOne(productFilter);
    if (!product) {
      return NextResponse.json({ error: 'Product record not found in database' }, { status: 404 });
    }

    const prevStock = Number(product.stock) || 0;
    const finalStock = newStock !== undefined ? Math.max(0, Number(newStock)) : Math.max(0, prevStock + Number(change));
    const diff = finalStock - prevStock;
    const lowStockThreshold = Number(product.lowStockThreshold) || 5;
    const reservedStock = Number(product.reservedStock) || 0;
    const availableStock = Math.max(0, finalStock - reservedStock);

    const status = finalStock === 0 ? 'out_of_stock' : finalStock <= lowStockThreshold ? 'low_stock' : 'in_stock';
    let prodStatus = product.status;
    if (finalStock === 0 && prodStatus === 'active') {
      prodStatus = 'out_of_stock';
    } else if (finalStock > 0 && prodStatus === 'out_of_stock') {
      prodStatus = 'active';
    }

    const historyEntry = {
      id: `hist-${Date.now()}`,
      previous: prevStock,
      change: diff,
      new: finalStock,
      reason: reason || 'Manual Admin Stock Adjustment',
      admin: session.name,
      timestamp: new Date().toISOString(),
    };

    // 1. Atomically update the authoritative Product in MongoDB
    await db.collection('products').updateOne(productFilter, {
      $set: {
        stock: finalStock,
        inStock: finalStock > 0,
        status: prodStatus,
        updatedAt: new Date().toISOString(),
      },
    });

    // 2. Synchronize inventory record with adjustment history
    const resolvedId = product.id || product._id.toString();
    await db.collection('inventory').updateOne(
      { productId: resolvedId },
      {
        $set: {
          productId: resolvedId,
          sku: product.sku,
          productName: product.name,
          productImage: (Array.isArray(product.images) ? product.images[0] : product.images) || '/images/products/ring-minimal-silver-01.jpg',
          currentStock: finalStock,
          availableStock,
          lowStockThreshold,
          status,
          updatedAt: new Date().toISOString(),
        },
        $push: {
          history: {
            $each: [historyEntry],
            $position: 0,
          },
        } as any,
      },
      { upsert: true }
    );

    // 3. Log audit event
    await logAuditMongo(
      session.name,
      session.email,
      'STOCK_CHANGED',
      'Inventory',
      resolvedId,
      `Adjusted stock for "${product.name}" from ${prevStock} to ${finalStock} (${diff >= 0 ? '+' : ''}${diff}) — ${reason || 'Manual Adjustment'}`
    );

    const updatedRecord = {
      id: `inv-${resolvedId}`,
      productId: resolvedId,
      productName: product.name,
      sku: product.sku,
      currentStock: finalStock,
      availableStock,
      lowStockThreshold,
      status,
      history: [historyEntry],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, record: updatedRecord });
  } catch (error: any) {
    console.error('Error adjusting inventory stock:', error);
    return NextResponse.json({ error: error.message || 'Failed to update stock' }, { status: 500 });
  }
}
