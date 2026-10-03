'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { DbNavigationItem } from '@/lib/db/types';

export interface NavigationChildCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  productCount: number;
  sortOrder: number;
}

export interface NavigationCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  megaMenuImage?: string | null;
  productCount: number;
  sortOrder: number;
  children: NavigationChildCategory[];
}

export interface NavigationCollection {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  productCount: number;
  sortOrder: number;
}

interface NavigationContextType {
  categories: NavigationCategory[];
  collections: NavigationCollection[];
  navbarItems: DbNavigationItem[];
  loading: boolean;
  error: string | null;
  refreshNavigation: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType>({
  categories: [],
  collections: [],
  navbarItems: [],
  loading: true,
  error: null,
  refreshNavigation: async () => {},
});

export function NavigationProvider({
  children,
  initialNavbarItems = [],
}: {
  children: React.ReactNode;
  initialNavbarItems?: DbNavigationItem[];
}) {
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [collections, setCollections] = useState<NavigationCollection[]>([]);
  const [navbarItems, setNavbarItems] = useState<DbNavigationItem[]>(initialNavbarItems);
  const [loading, setLoading] = useState(initialNavbarItems.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchNavigation = useCallback(async () => {
    try {
      const [catRes, navRes] = await Promise.all([
        fetch('/api/categories/navigation', { cache: 'no-store' }),
        fetch('/api/navbar', { cache: 'no-store' }),
      ]);

      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(Array.isArray(data.categories) ? data.categories : []);
        setCollections(Array.isArray(data.collections) ? data.collections : []);
      }

      if (navRes.ok) {
        const navData = await navRes.json();
        setNavbarItems(Array.isArray(navData.navigation) ? navData.navigation : []);
      }

      setError(null);
    } catch (err: any) {
      console.error('[NavigationProvider] Error loading navigation:', err);
      setError(err?.message || 'Unable to load navigation categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavigation();

    const handleUpdate = () => {
      fetchNavigation();
    };

    window.addEventListener('mk:category-updated', handleUpdate);
    window.addEventListener('mk:collection-updated', handleUpdate);
    window.addEventListener('mk:navbar-updated', handleUpdate);
    window.addEventListener('mk:refresh-navigation', handleUpdate);

    return () => {
      window.removeEventListener('mk:category-updated', handleUpdate);
      window.removeEventListener('mk:collection-updated', handleUpdate);
      window.removeEventListener('mk:navbar-updated', handleUpdate);
      window.removeEventListener('mk:refresh-navigation', handleUpdate);
    };
  }, [fetchNavigation]);

  return (
    <NavigationContext.Provider
      value={{
        categories,
        collections,
        navbarItems,
        loading,
        error,
        refreshNavigation: fetchNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
