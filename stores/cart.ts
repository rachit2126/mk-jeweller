import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/types';
import { calculateCartSummary } from '@/lib/commerce/cart-math';

export interface CartLine {
  lineId: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  customEngraving?: string;
  engravingFee?: number;
}

interface CartStore {
  lines: CartLine[];
  couponCode: string;
  discountAmount: number;
  addLine: (product: Product, quantity?: number, variantId?: string, variantLabel?: string, customEngraving?: string) => void;
  removeLine: (lineId: string) => void;
  updateQty: (lineId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: '',
      discountAmount: 0,

      addLine: (product, quantity = 1, variantId, variantLabel, customEngraving) => {
        const lineId = `${product.id}-${variantId || 'std'}-${customEngraving || ''}`;
        set((state) => {
          const existingIdx = state.lines.findIndex((l) => l.lineId === lineId);
          if (existingIdx > -1) {
            const next = [...state.lines];
            const existing = next[existingIdx];
            if (existing) {
              existing.quantity += quantity;
            }
            return { lines: next };
          }
          return {
            lines: [
              ...state.lines,
              {
                lineId,
                product,
                quantity,
                variantId,
                variantLabel,
                customEngraving,
                engravingFee: customEngraving ? 199 : 0
              }
            ]
          };
        });
      },

      removeLine: (lineId) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.lineId !== lineId)
        }));
      },

      updateQty: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeLine(lineId);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
        }));
      },

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'FIRST10') {
          const lines = get().lines;
          const subtotal = lines.reduce((acc, l) => acc + l.product.price * l.quantity, 0);
          const discount = Math.round(subtotal * 0.1);
          set({ couponCode: clean, discountAmount: discount });
          return { success: true, message: 'Privilege code FIRST10 applied (10% off).' };
        }
        return { success: false, message: 'Invalid coupon. Use code FIRST10.' };
      },

      removeCoupon: () => {
        set({ couponCode: '', discountAmount: 0 });
      },

      clearCart: () => set({ lines: [], couponCode: '', discountAmount: 0 })
    }),
    {
      name: 'mk_silver_hub_cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export function useCartSummary() {
  const lines = useCartStore((s) => s.lines);
  const discountAmount = useCartStore((s) => s.discountAmount);

  const cartLineItems = lines.map((l) => ({
    id: l.lineId,
    price: l.product.price,
    quantity: l.quantity,
    customEngravingFee: l.engravingFee
  }));

  const summary = calculateCartSummary(cartLineItems, discountAmount);
  const totalCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  return { ...summary, totalCount, lines };
}
