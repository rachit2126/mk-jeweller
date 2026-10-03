'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import ProductSlider from '@/components/products/ProductSlider';

export default function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?isBestSeller=true&limit=12')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to load best sellers:', err))
      .finally(() => setLoading(false));
  }, []);

  // If loading finished and 0 products found with isBestSeller flag, fetch general active products so storefront is alive
  useEffect(() => {
    if (!loading && products.length === 0) {
      fetch('/api/products?limit=12')
        .then((res) => res.json())
        .then((data) => {
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        })
        .catch((err) => console.error('Failed fallback products fetch:', err));
    }
  }, [loading, products.length]);

  return (
    <ProductSlider
      products={products}
      loading={loading}
      eyebrow="POPULAR CHOICES"
      title="BEST SELLERS"
      subtitle="The pieces everyone is wearing."
      viewAllHref="/shop?isBestSeller=true"
      viewAllText="View All"
      emptyMessage="No best selling pieces available yet."
      sectionId="best-sellers"
      backgroundColor="#FFFFFF"
    />
  );
}
