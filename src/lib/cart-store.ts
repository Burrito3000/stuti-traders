import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { WHATSAPP_NUMBER } from "./constants";

export interface CartItem {
  product: Product;
  quantity: number;
  unit: "pcs" | "dz";
}

export interface CustomerDetails {
  name: string;
  businessName: string;
  phone: string;
  address: string;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, unit?: "pcs" | "dz") => void;
  removeItem: (productId: string, unit: "pcs" | "dz") => void;
  updateQuantity: (productId: string, unit: "pcs" | "dz", quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getWhatsAppOrderUrl: (details: CustomerDetails) => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, unit = "pcs") => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product.id === product.id && i.unit === unit
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }

          return { items: [...state.items, { product, quantity, unit }] };
        });
      },

      removeItem: (productId, unit) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.unit === unit)
          ),
        }));
      },

      updateQuantity: (productId, unit, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, unit);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.unit === unit
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getWhatsAppOrderUrl: (details) => {
        const { items } = get();
        if (items.length === 0) return "";

        // Build formatted order message
        const lines: string[] = [];
        lines.push("📋 *Wholesale Inquiry — Stuti Traders*");
        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");
        lines.push("👤 *Customer/Business Details:*");
        lines.push(`• Contact Name: ${details.name}`);
        lines.push(`• Store/Business: ${details.businessName}`);
        lines.push(`• Phone Number: ${details.phone}`);
        lines.push(`• Delivery Address: ${details.address}`);
        if (details.notes) {
          lines.push(`• Notes/Requirements: ${details.notes}`);
        }
        lines.push("");
        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");
        lines.push("📦 *Items Requested:*");

        items.forEach((item, index) => {
          lines.push(`*${index + 1}. ${item.product.name}*`);
          if (item.product.sku) {
            lines.push(`   SKU: ${item.product.sku}`);
          }
          const unitLabel = item.unit === "dz" ? "dozen" + (item.quantity === 1 ? "" : "s") : "unit" + (item.quantity === 1 ? "" : "s");
          lines.push(`   Quantity: ${item.quantity} ${unitLabel}`);
          lines.push("");
        });

        // Calculate distinct totals by unit
        const pcsCount = items.filter(i => i.unit === "pcs").reduce((sum, i) => sum + i.quantity, 0);
        const dzCount = items.filter(i => i.unit === "dz").reduce((sum, i) => sum + i.quantity, 0);
        
        const totalParts = [];
        if (pcsCount > 0) totalParts.push(`${pcsCount} pcs`);
        if (dzCount > 0) totalParts.push(`${dzCount} dozen${dzCount === 1 ? "" : "s"}`);

        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push(`💼 Total Volume: *${totalParts.join(" + ")}*`);
        lines.push("━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");
        lines.push("Please confirm availability and share the wholesale quotation/best rates. Thank you! 🙏");

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
