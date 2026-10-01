import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentUser, getCurrentAdmin } from '@/lib/services/auth';

function buildFilterQuery(id: string): any {
  const cleanId = id.trim();
  const isObjectId = ObjectId.isValid(cleanId) && cleanId.length === 24;

  if (isObjectId) {
    return {
      $or: [
        { _id: new ObjectId(cleanId) },
        { id: cleanId },
        { slug: cleanId },
      ],
    };
  }

  return {
    $or: [
      { id: cleanId },
      { slug: cleanId },
    ],
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id || typeof id !== 'string' || !id.trim() || id.trim() === 'undefined' || id.trim() === 'null') {
    return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
  }

  const db = await connectDB();
  const product = await db.collection('products').findOne(buildFilterQuery(id));

  if (!product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  const { _id, ...rest } = product;
  return NextResponse.json({ success: true, product: { ...rest, id: rest.id || _id?.toString() } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id || typeof id !== 'string' || !id.trim() || id.trim() === 'undefined' || id.trim() === 'null') {
    return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 });
  }

  const updates = await req.json();
  const db = await connectDB();
  const oldProduct = await db.collection('products').findOne(buildFilterQuery(id));

  if (!oldProduct) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  const productId = oldProduct.id || oldProduct._id.toString();

  // Detect stock change to record in inventory history
  if (typeof updates.stock === 'number' && updates.stock !== oldProduct.stock) {
    const inv = await db.collection('inventory').findOne({
      $or: [{ productId }, { productId: oldProduct.id }, { productId: oldProduct._id.toString() }],
    });
    if (inv) {
      const oldStock = inv.currentStock;
      const diff = updates.stock - oldStock;
      await db.collection('inventory').updateOne(
        { _id: inv._id },
        {
          $set: {
            currentStock: updates.stock,
            availableStock: updates.stock - (inv.reservedStock || 0),
            status: updates.stock === 0 ? 'out_of_stock' : updates.stock <= 5 ? 'low_stock' : 'in_stock',
            updatedAt: new Date().toISOString(),
          },
          $push: {
            history: {
              $each: [
                {
                  id: `hist-${Date.now()}`,
                  previous: oldStock,
                  change: diff,
                  new: updates.stock,
                  reason: 'Product Editor Update',
                  admin: session.name,
                  timestamp: new Date().toISOString(),
                },
              ],
              $position: 0,
            },
          } as any,
        }
      );
    }
  }

  // Detect price change audit
  if (typeof updates.price === 'number' && updates.price !== oldProduct.price) {
    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: session.name,
      adminEmail: session.email,
      action: 'PRICE_CHANGED',
      resource: 'Product',
      resourceId: productId,
      details: `Changed price of "${oldProduct.name}" from ₹${oldProduct.price} to ₹${updates.price}`,
      timestamp: new Date().toISOString(),
    });
  }

  const updatedProduct = {
    ...oldProduct,
    ...updates,
    inStock: (typeof updates.stock === 'number' ? updates.stock : oldProduct.stock) > 0,
    updatedAt: new Date().toISOString(),
  };
  delete (updatedProduct as any)._id;

  await db.collection('products').updateOne(
    { _id: oldProduct._id },
    { $set: updatedProduct }
  );

  await db.collection('audit_logs').insertOne({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminName: session.name,
    adminEmail: session.email,
    action: 'PRODUCT_EDITED',
    resource: 'Product',
    resourceId: productId,
    details: `Updated product details for "${updatedProduct.name}"`,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, product: updatedProduct });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1. Authentication Check
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Please sign in to continue.' },
      { status: 401 }
    );
  }

  // 2. Authorization / Role Check
  const role = (user.role || '').toUpperCase();
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'MANAGER') {
    return NextResponse.json(
      { success: false, error: "You don't have permission to delete products." },
      { status: 403 }
    );
  }

  // 3. ID Validation
  const { id } = await params;
  if (!id || typeof id !== 'string' || !id.trim() || id.trim() === 'undefined' || id.trim() === 'null') {
    return NextResponse.json(
      { success: false, error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  const cleanId = id.trim();
  const db = await connectDB();
  const product = await db.collection('products').findOne(buildFilterQuery(cleanId));

  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }

  const targetIds = [product.id, product._id?.toString()].filter(Boolean);

  // 4. Check whether historical orders reference this product
  const referencedOrders = await db.collection('orders').countDocuments({
    'items.productId': { $in: targetIds },
  });

  if (referencedOrders > 0) {
    // Soft delete / archive product to preserve order history integrity
    const updateResult = await db.collection('products').updateOne(
      { _id: product._id },
      {
        $set: {
          status: 'archived',
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.collection('inventory').updateOne(
      { productId: { $in: targetIds } },
      { $set: { status: 'discontinued', updatedAt: new Date().toISOString() } }
    );

    await db.collection('audit_logs').insertOne({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      adminName: user.name,
      adminEmail: user.email,
      action: 'PRODUCT_ARCHIVED',
      resource: 'Product',
      resourceId: product.id || product._id.toString(),
      details: `Archived product "${product.name}" (SKU: ${product.sku}) because it is referenced in ${referencedOrders} order(s)`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Product archived successfully',
      productId: product.id || product._id.toString(),
      action: 'archived',
    });
  }

  // 5. Hard delete if no orders reference this product
  const deleteResult = await db.collection('products').deleteOne({ _id: product._id });

  if (deleteResult.deletedCount === 0) {
    return NextResponse.json(
      { success: false, error: 'Product not found or already deleted' },
      { status: 404 }
    );
  }

  // Remove corresponding inventory entry
  await db.collection('inventory').deleteOne({ productId: { $in: targetIds } });

  // Log to audit trail
  await db.collection('audit_logs').insertOne({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminName: user.name,
    adminEmail: user.email,
    action: 'PRODUCT_DELETED',
    resource: 'Product',
    resourceId: product.id || product._id.toString(),
    details: `Permanently deleted product "${product.name}" (SKU: ${product.sku}) from MongoDB`,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    message: 'Product deleted successfully',
    productId: product.id || product._id.toString(),
    action: 'deleted',
  });
}
