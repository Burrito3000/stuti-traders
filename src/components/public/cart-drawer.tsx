"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getWhatsAppOrderUrl = useCartStore((s) => s.getWhatsAppOrderUrl);

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const itemCount = mounted ? getItemCount() : 0;
  const total = mounted ? getTotal() : 0;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] active:scale-95"
      >
        <ShoppingBag className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white"
          >
            {itemCount}
          </motion.span>
        )}
      </button>

      {/* Cart Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-[440px]"
        >
          <SheetHeader className="border-b border-[#EAEAEA] px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="font-heading text-lg font-semibold text-[#111111]">
                  Your Order
                </SheetTitle>
                <SheetDescription className="mt-0.5 text-sm text-[#999999]">
                  {itemCount === 0
                    ? "No items added yet"
                    : `${itemCount} item${itemCount === 1 ? "" : "s"} in your order`}
                </SheetDescription>
              </div>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 gap-1.5 rounded-[10px] text-xs text-[#999999] hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F5]">
                  <ShoppingBag className="h-7 w-7 text-[#CCCCCC]" />
                </div>
                <p className="mt-4 text-sm font-medium text-[#666666]">
                  Your order is empty
                </p>
                <p className="mt-1 text-xs text-[#999999]">
                  Browse products and add items to get started
                </p>
                <Button
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-[12px] bg-[#111111] text-white hover:bg-[#333]"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 rounded-[16px] border border-[#EAEAEA] bg-white p-3"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] bg-[#F5F5F5]">
                        {item.product.images?.[0]?.url && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <p className="truncate text-sm font-medium text-[#111111]">
                            {item.product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#999999]">
                            {formatPrice(item.product.price)} each
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#EAEAEA] text-[#666666] transition-colors hover:bg-[#F5F5F5]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-[#111111]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#EAEAEA] text-[#666666] transition-colors hover:bg-[#F5F5F5]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <p className="text-sm font-semibold text-[#111111]">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#CCCCCC] transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer — Total + Buy Now */}
          {items.length > 0 && (
            <div className="border-t border-[#EAEAEA] bg-white px-6 py-5">
              {/* Totals */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#666666]">Items</span>
                  <span className="text-[#111111]">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111111]">Total</span>
                  <span className="text-lg font-bold text-[#111111]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* WhatsApp Order Button */}
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#25D366] font-heading text-[15px] font-semibold text-white transition-all hover:bg-[#1fb855] hover:shadow-[0_4px_20px_rgba(37,211,102,0.3)] active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </a>

              <p className="mt-3 text-center text-[11px] text-[#999999]">
                This will open WhatsApp with your order details
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
