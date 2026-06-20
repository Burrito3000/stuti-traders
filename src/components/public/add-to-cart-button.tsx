"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  product: Product;
  variant?: "compact" | "full";
  className?: string;
}

export function AddToCartButton({
  product,
  variant = "compact",
  className = "",
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<"pcs" | "dz">("pcs");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  const existingItem = items.find((i) => i.product.id === product.id && i.unit === unit);

  const handleAdd = () => {
    addItem(product, quantity, unit);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  };

  if (variant === "full") {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Quantity & Unit Selectors */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#666666]">Quantity</span>
            <div className="flex items-center gap-0 rounded-[12px] border border-[#EAEAEA] bg-white shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-l-[12px] text-[#666666] transition-colors hover:bg-[#F5F5F5]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center border-x border-[#EAEAEA] text-sm font-semibold text-[#111111]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-r-[12px] text-[#666666] transition-colors hover:bg-[#F5F5F5]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Unit Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#666666] sm:ml-4">Unit</span>
            <div className="flex rounded-[12px] border border-[#EAEAEA] bg-[#F5F5F5] p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setUnit("pcs")}
                className={`rounded-[10px] px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  unit === "pcs"
                    ? "bg-white text-[#111111] shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                    : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                Units (Pcs)
              </button>
              <button
                type="button"
                onClick={() => setUnit("dz")}
                className={`rounded-[10px] px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  unit === "dz"
                    ? "bg-white text-[#111111] shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                    : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                Dozens (Dz)
              </button>
            </div>
          </div>
        </div>

        {existingItem && (
          <p className="text-xs text-[#999999]">
            ({existingItem.quantity} {unit === "dz" ? "dozen" + (existingItem.quantity === 1 ? "" : "s") : "unit" + (existingItem.quantity === 1 ? "" : "s")} already in cart)
          </p>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={added}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#111111] font-heading text-[15px] font-semibold text-white transition-all hover:bg-[#333] hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] disabled:opacity-70 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <Check className="h-5 w-5" />
                Added to Order
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Order
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    );
  }

  // Compact variant — for product cards (defaults to units/pieces)
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, "pcs");
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={`flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[13px] font-medium transition-all ${
        added
          ? "bg-green-50 text-green-600"
          : "bg-[#F5F5F5] text-[#666666] hover:bg-[#111111] hover:text-white"
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Added
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" />
          Add
        </>
      )}
    </button>
  );
}
