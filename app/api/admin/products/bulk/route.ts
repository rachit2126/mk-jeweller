import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs array required' }, { status: 400 });
    }

    const db = await connectDB();
    const productsCol = db.collection('products');
    const ordersCol = db.collection('orders');

    let deletedCount = 0;
    let archivedCount = 0;

    for (const id of ids) {
      const isObjectId = ObjectId.isValid(id) && id.length === 24;
      const filter = isObjectId
        ? { $or: [{ _id: new ObjectId(id) }, { id }] }
        : { id };

      const product = await productsCol.findOne(filter);
      if (!product) continue;

      // Check if product has orders
      const hasOrders = await ordersCol.countDocuments({
        $or: [
          { 'items.productId': product.id },
          { 'items.id': product.id },
          { 'items.productId': product._id?.toString() },
        ],
      });

      if (hasOrders > 0) {
        // Soft delete/archive
        await productsCol.updateOne(
          { _id: product._id },
          {
            $set: {
              status: 'archived',
              isDeleted: true,
              updatedAt: new Date().toISOString(),
            },
          }
        );
        archivedCount++;
      } else {
        // Hard delete
        await productsCol.deleteOne({ _id: product._id });
        deletedCount++;
      }
    }

    await logAuditMongo(
      session.name,
      session.email,
      'BULK_PRODUCTS_DELETED',
      'Products',
      ids.join(', '),
      `Bulk deleted/archived ${deletedCount + archivedCount} products from MongoDB`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${deletedCount + archivedCount} products`,
      deletedCount,
      archivedCount,
    });
  } catch (error: any) {
    console.error('[Bulk Delete API Error]:', error?.message);
    return NextResponse.json({ error: error?.message || 'Failed to bulk delete products' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ids, status } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs array required' }, { status: 400 });
    }

    if (!status || !['active', 'draft', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Valid status required (active, draft, archived)' }, { status: 400 });
    }

    const db = await connectDB();
    const productsCol = db.collection('products');

    const objectIds = ids.filter((id: string) => ObjectId.isValid(id) && id.length === 24).map((id: string) => new ObjectId(id));
    
    const filter = {
      $or: [
        { id: { $in: ids } },
        ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : []),
      ],
    };

    const updateResult = await productsCol.updateMany(filter, {
      $set: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });

    await logAuditMongo(
      session.name,
      session.email,
      'BULK_PRODUCTS_UPDATED',
      'Products',
      ids.join(', '),
      `Updated status of ${updateResult.modifiedCount} products to "${status}" in MongoDB`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updateResult.modifiedCount} products to ${status}`,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error: any) {
    console.error('[Bulk Update API Error]:', error?.message);
    return NextResponse.json({ error: error?.message || 'Failed to bulk update products' }, { status: 500 });
  }
}

