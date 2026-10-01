'use client';

import React, { useState, useEffect, use } from 'react';
import ProductEditor from '@/components/admin/ProductEditor';
import { DbProduct } from '@/lib/db/types';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#806D68' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#C53030' }}>Product not found.</div>;
  }

  return <ProductEditor initialProduct={product} isEditing={true} />;
}
