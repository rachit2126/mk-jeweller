import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedState {
  slugs: string[];
  addSlug: (slug: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      slugs: [],
      addSlug: (slug: string) =>
        set((state) => {
          const filtered = state.slugs.filter((s) => s !== slug);
          return { slugs: [slug, ...filtered].slice(0, 10) };
        }),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: 'mk-recently-viewed',
    }
  )
);
