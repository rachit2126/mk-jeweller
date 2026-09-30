import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentSearchesState {
  searches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clear: () => void;
}

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set) => ({
      searches: ['chandbali earrings', 'pearl necklace', 'ring size 12', '925 silver anklet'],
      addSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => {
          const filtered = state.searches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
          return { searches: [trimmed, ...filtered].slice(0, 8) };
        });
      },
      removeSearch: (query: string) =>
        set((state) => ({
          searches: state.searches.filter((s) => s !== query),
        })),
      clear: () => set({ searches: [] }),
    }),
    {
      name: 'mk-recent-searches',
    }
  )
);
