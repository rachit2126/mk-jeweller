import { connectDB, isMongoConfigured } from './mongodb';
import { DbNavigationItem } from './types';

let cachedNavTree: DbNavigationItem[] | null = null;
let navTreeCachedAt = 0;
let pendingNavPromise: Promise<DbNavigationItem[]> | null = null;
const NAV_CACHE_TTL = 60 * 1000; // 60s in-memory cache

export function invalidateNavigationCache() {
  cachedNavTree = null;
  navTreeCachedAt = 0;
  pendingNavPromise = null;
}

export async function getNavigationTree(): Promise<DbNavigationItem[]> {
  const now = Date.now();
  if (cachedNavTree && now - navTreeCachedAt < NAV_CACHE_TTL) {
    return cachedNavTree;
  }

  if (pendingNavPromise) {
    return pendingNavPromise;
  }

  pendingNavPromise = (async () => {
    try {
      if (!isMongoConfigured()) {
        return cachedNavTree || [];
      }
      const db = await connectDB();
      const navCol = db.collection('navigation');

    const allItems = await navCol
      .find({
        $or: [
          { isActive: true },
          { isActive: { $exists: false }, status: { $ne: 'inactive' } },
        ],
      })
      .sort({ order: 1, sortOrder: 1 })
      .toArray();

    // Query active products for dynamic product counts
    const activeProducts = await db
      .collection('products')
      .find(
        { isDeleted: { $ne: true }, status: { $ne: 'archived' } },
        { projection: { id: 1, name: 1, category: 1, subcategory: 1, subcategoryId: 1, tags: 1 } }
      )
      .toArray();

    // Build product count map
    const countBySlug = new Map<string, number>();
    activeProducts.forEach((p: any) => {
      const cat = (p.category || '').toLowerCase();
      const sub = (p.subcategory || p.subcategoryId || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      if (cat) countBySlug.set(cat, (countBySlug.get(cat) || 0) + 1);
      if (sub) countBySlug.set(sub, (countBySlug.get(sub) || 0) + 1);
      if (name) countBySlug.set(name, (countBySlug.get(name) || 0) + 1);
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t: string) => {
          const tag = t.toLowerCase();
          countBySlug.set(tag, (countBySlug.get(tag) || 0) + 1);
        });
      }
    });

    // Organize into root items and children
    const roots: DbNavigationItem[] = [];
    const childrenMap = new Map<string, DbNavigationItem[]>();

    allItems.forEach((raw: any) => {
      const { _id, ...item } = raw;
      const slug = (item.slug || item.label.toLowerCase().replace(/\s+/g, '-')).toLowerCase();
      const count = countBySlug.get(slug) || 0;

      const formatted: DbNavigationItem = {
        ...item,
        id: item.id || _id?.toString(),
        slug,
        order: item.order ?? item.sortOrder ?? 1,
        level: item.level ?? (item.parentId ? 2 : 1),
        isActive: true,
        megaMenuEnabled: Boolean(item.megaMenuEnabled),
        openInNewTab: Boolean(item.openInNewTab),
        productCount: count,
        children: [],
      };

      if (!item.parentId) {
        roots.push(formatted);
      } else {
        if (!childrenMap.has(item.parentId)) {
          childrenMap.set(item.parentId, []);
        }
        childrenMap.get(item.parentId)!.push(formatted);
      }
    });

    // Attach children to respective roots
    roots.forEach((root) => {
      root.children = (childrenMap.get(root.id) || []).sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      if (root.children.length > 0 && root.productCount === 0) {
        root.productCount = root.children.reduce((acc, c) => acc + (c.productCount || 0), 0);
      }
    });

    cachedNavTree = roots;
    navTreeCachedAt = Date.now();
    return roots;
  } catch (error) {
    console.error('[getNavigationTree error]:', error);
    return cachedNavTree || [];
  } finally {
    pendingNavPromise = null;
  }
  })();

  return pendingNavPromise;
}
