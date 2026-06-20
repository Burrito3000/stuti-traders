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
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  const existingItem = items.find((i) => i.product.id === product.id);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  };

  if (variant === "full") {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#666666]">Quantity</span>
          <div className="flex items-center gap-0 rounded-[12px] border border-[#EAEAEA] bg-white">
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
          {existingItem && (
            <span className="text-xs text-[#999999]">
              ({existingItem.quantity} already in order)
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={added}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#111111] font-heading text-[15px] font-semibold text-white transition-all hover:bg-[#333] hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] disabled:opacity-70"
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

  // Compact variant — for product cards
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
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
