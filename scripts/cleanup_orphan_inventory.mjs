import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}
const uri = match[1].trim();

async function cleanup() {
  console.log('Connecting to MongoDB Atlas to align inventory with active products...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');

  const productsCol = db.collection('products');
  const inventoryCol = db.collection('inventory');

  const activeProducts = await productsCol.find({
    isDeleted: { $ne: true },
    status: { $ne: 'archived' },
  }).toArray();

  console.log(`Active non-deleted products in MongoDB: ${activeProducts.length}`);
  const activeProductIds = new Set(activeProducts.map(p => p.id));
  activeProducts.forEach(p => console.log(`- Product: [${p.id}] ${p.name} (SKU: ${p.sku}, Stock: ${p.stock})`));

  const allInventory = await inventoryCol.find({}).toArray();
  console.log(`Current inventory records in MongoDB: ${allInventory.length}`);

  // Find inventory records whose productId does not belong to any active product
  const orphanInventory = allInventory.filter(inv => !activeProductIds.has(inv.productId));
  console.log(`Identified ${orphanInventory.length} orphan/mock inventory records to remove.`);

  if (orphanInventory.length > 0) {
    const orphanIds = orphanInventory.map(i => i._id);
    const deleteResult = await inventoryCol.deleteMany({ _id: { $in: orphanIds } });
    console.log(`✓ Safely removed ${deleteResult.deletedCount} orphan inventory records.`);
  }

  // Ensure every active product has a corresponding inventory tracking record
  for (const prod of activeProducts) {
    const existing = await inventoryCol.findOne({ productId: prod.id });
    const stock = Number(prod.stock) || 0;
    const threshold = Number(prod.lowStockThreshold) || 5;
    const reserved = Number(prod.reservedStock) || 0;
    const available = Math.max(0, stock - reserved);
    const status = stock <= 0 ? 'out_of_stock' : stock <= threshold ? 'low_stock' : 'in_stock';

    if (!existing) {
      await inventoryCol.insertOne({
        id: `inv-${prod.id}`,
        productId: prod.id,
        sku: prod.sku || 'MK-GEN',
        productName: prod.name,
        productImage: (Array.isArray(prod.images) ? prod.images[0] : prod.images) || '/images/products/ring-minimal-silver-01.jpg',
        currentStock: stock,
        reservedStock: reserved,
        availableStock: available,
        lowStockThreshold: threshold,
        status,
        history: [
          {
            id: `hist-${Date.now()}`,
            previous: 0,
            change: stock,
            new: stock,
            reason: 'Initial Inventory Stocking',
            admin: 'Rachit Sharma',
            timestamp: new Date().toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
      });
      console.log(`✓ Created synchronized inventory record for active product: ${prod.name}`);
    } else {
      await inventoryCol.updateOne(
        { productId: prod.id },
        {
          $set: {
            sku: prod.sku || existing.sku,
            productName: prod.name,
            currentStock: stock,
            availableStock: available,
            lowStockThreshold: threshold,
            status,
            updatedAt: new Date().toISOString(),
          },
        }
      );
      console.log(`✓ Synchronized existing inventory record for active product: ${prod.name}`);
    }
  }

  const remaining = await inventoryCol.countDocuments({});
  console.log(`\nFinal inventory records in MongoDB: ${remaining}`);
  console.log(`Final active products in MongoDB: ${activeProducts.length}`);
  console.log('Synchronized 1:1 between Products and Inventory!');

  await client.close();
}

cleanup().catch(err => {
  console.error('Inventory cleanup error:', err);
  process.exit(1);
});
