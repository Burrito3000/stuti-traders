import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { WHATSAPP_NUMBER, formatPrice } from "./constants";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  getWhatsAppOrderUrl: () => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        );
      },

      getWhatsAppOrderUrl: () => {
        const { items } = get();
        if (items.length === 0) return "";

        const total = get().getTotal();
        const itemCount = get().getItemCount();

        // Build formatted order message
        const lines: string[] = [];
        lines.push("🛒 *New Order Request — Stuti Traders*");
        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");

        items.forEach((item, index) => {
          const lineTotal = item.product.price * item.quantity;
          lines.push(`*${index + 1}. ${item.product.name}*`);
          if (item.product.sku) {
            lines.push(`   SKU: ${item.product.sku}`);
          }
          lines.push(
            `   Qty: ${item.quantity} × ${formatPrice(item.product.price)} = *${formatPrice(lineTotal)}*`
          );
          lines.push("");
        });

        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push(`📦 Total Items: *${itemCount}*`);
        lines.push(`💰 Order Total: *${formatPrice(total)}*`);
        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");
        lines.push("📍 *Delivery Details:*");
        lines.push("Name: ");
        lines.push("Address: ");
        lines.push("Phone: ");
        lines.push("");
        lines.push("Please confirm availability and share payment details. 🙏");

        const message = encodeURIComponent(lines.join("\n"));
        const phone = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
        return `https://wa.me/${phone}?text=${message}`;
      },
    }),
    {
      name: "stuti-traders-cart",
    }
  )
);
