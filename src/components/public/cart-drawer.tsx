"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle, ArrowLeft } from "lucide-react";
import { useCartStore, CartItem } from "@/lib/cart-store";
import { dbAddOrderInquiry } from "@/lib/db-simulator";
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
  const [step, setStep] = useState<"cart" | "details">("cart");
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getWhatsAppOrderUrl = useCartStore((s) => s.getWhatsAppOrderUrl);

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Load customer info if previously saved in localStorage
    const savedDetails = localStorage.getItem("stuti_wholesale_details");
    if (savedDetails) {
      try {
        setForm(JSON.parse(savedDetails));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Format the total items string cleanly by separating pcs and dzs
  const getFormattedTotalItems = () => {
    const pcs = items.filter((i) => i.unit === "pcs").reduce((sum, i) => sum + i.quantity, 0);
    const dz = items.filter((i) => i.unit === "dz").reduce((sum, i) => sum + i.quantity, 0);

    const parts = [];
    if (pcs > 0) parts.push(`${pcs} unit${pcs === 1 ? "" : "s"}`);
    if (dz > 0) parts.push(`${dz} dozen${dz === 1 ? "" : "s"}`);

    return parts.length > 0 ? parts.join(", ") : "0 items";
  };

  const getFormattedSummary = () => {
    const pcs = items.filter((i) => i.unit === "pcs").reduce((sum, i) => sum + i.quantity, 0);
    const dz = items.filter((i) => i.unit === "dz").reduce((sum, i) => sum + i.quantity, 0);

    const parts = [];
    if (pcs > 0) parts.push(`${pcs} pcs`);
    if (dz > 0) parts.push(`${dz} dz`);

    return parts.length > 0 ? parts.join(" + ") : "0 items";
  };

  // Reset checkout step when opening/closing
  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep("cart"), 300);
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleUnit = (item: CartItem) => {
    const nextUnit = item.unit === "pcs" ? "dz" : "pcs";
    removeItem(item.product.id, item.unit);
    addItem(item.product, item.quantity, nextUnit);
  };

  const handleProceedToDetails = () => {
    if (items.length > 0) {
      setStep("details");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Contact name is required";
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Delivery address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save details to localStorage for convenience on future orders
    localStorage.setItem("stuti_wholesale_details", JSON.stringify(form));

    // Save order & customer to the database simulator (localStorage)
    dbAddOrderInquiry(form, items);

    // Generate WhatsApp URL
    const whatsappUrl = getWhatsAppOrderUrl(form);

    // Clear cart and close drawer
    clearCart();
    setOpen(false);

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] active:scale-95"
      >
        <ShoppingBag className="h-5 w-5" />
        {mounted && items.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white"
          >
            {items.length}
          </motion.span>
        )}
      </button>

      {/* Cart Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-[440px] border-l border-[#EAEAEA]"
        >
          {/* Header */}
          <SheetHeader className="border-b border-[#EAEAEA] px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step === "details" && (
                  <button
                    onClick={() => setStep("cart")}
                    className="mr-1 rounded-full p-1 text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <div>
                  <SheetTitle className="font-heading text-lg font-semibold text-[#111111]">
                    {step === "cart" ? "Your Inquiry Cart" : "Business Details"}
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-sm text-[#999999]">
                    {step === "cart"
                      ? `${getFormattedTotalItems()} selected for wholesale enquiry`
                      : "Provide details to submit inquiry via WhatsApp"}
                  </SheetDescription>
                </div>
              </div>
              {step === "cart" && items.length > 0 && (
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

          {/* Cart Step */}
          {step === "cart" ? (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F5]">
                      <ShoppingBag className="h-7 w-7 text-[#CCCCCC]" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#666666]">
                      Your enquiry cart is empty
                    </p>
                    <p className="mt-1 text-xs text-[#999999]">
                      Browse products and add items to request a quote
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
                          key={`${item.product.id}-${item.unit}`}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4 rounded-[16px] border border-[#EAEAEA] bg-white p-3"
                        >
                          {/* Image */}
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#F5F5F5]">
                            {item.product.images?.[0]?.url && (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                            <div>
                              <p className="truncate text-sm font-medium text-[#111111]">
                                {item.product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.product.sku && (
                                  <p className="text-[11px] text-[#999999]">
                                    SKU: {item.product.sku}
                                  </p>
                                )}
                                <span className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#666666]">
                                  {item.unit === "dz" ? "Dozens" : "Units"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity controls */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product.id, item.unit, item.quantity - 1)
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
                                    updateQuantity(item.product.id, item.unit, item.quantity + 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#EAEAEA] text-[#666666] transition-colors hover:bg-[#F5F5F5]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Unit Toggle Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleUnit(item)}
                                className="rounded-[8px] border border-[#EAEAEA] bg-[#F5F5F5] px-2 py-1 text-[10px] font-bold text-[#666666] hover:bg-[#111111] hover:text-white transition-colors"
                              >
                                {item.unit === "pcs" ? "Switch to Dozens" : "Switch to Units"}
                              </button>
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.product.id, item.unit)}
                            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#CCCCCC] transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t border-[#EAEAEA] bg-white px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-[#111111]">Total Items</span>
                      <p className="text-[11px] text-[#999999] mt-0.5">
                        Prices are negotiated based on volume.
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#111111] text-right">
                      {getFormattedSummary()}
                    </span>
                  </div>

                  <Button
                    onClick={handleProceedToDetails}
                    className="w-full h-12 rounded-[14px] bg-[#111111] text-white hover:bg-[#333] font-heading text-[15px] font-semibold transition-all"
                  >
                    Proceed to Wholesale Details
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Details Form Step */
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="px-6 py-5 space-y-4">
                {/* Contact Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ram Bahadur"
                    className={`flex h-11 w-full rounded-[12px] border ${
                      errors.name ? "border-red-500" : "border-[#EAEAEA]"
                    } bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Business Name */}
                <div className="space-y-1.5">
                  <label htmlFor="businessName" className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Business / Store Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g. Bajra Store Wholesale"
                    className={`flex h-11 w-full rounded-[12px] border ${
                      errors.businessName ? "border-red-500" : "border-[#EAEAEA]"
                    } bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors`}
                  />
                  {errors.businessName && (
                    <p className="text-xs text-red-500 font-medium">{errors.businessName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +977 98XXXXXXX"
                    className={`flex h-11 w-full rounded-[12px] border ${
                      errors.phone ? "border-red-500" : "border-[#EAEAEA]"
                    } bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Delivery Address / City *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Kalimati, Kathmandu"
                    className={`flex w-full rounded-[12px] border ${
                      errors.address ? "border-red-500" : "border-[#EAEAEA]"
                    } bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors resize-none`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* Enquiry Notes */}
                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Enquiry Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    value={form.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Prefer red color for plastic buckets, need delivery by Friday"
                    className="flex w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Footer */}
              <div className="border-t border-[#EAEAEA] bg-white px-6 py-5">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#25D366] font-heading text-[15px] font-semibold text-white transition-all hover:bg-[#1fb855] hover:shadow-[0_4px_20px_rgba(37,211,102,0.3)] active:scale-[0.98]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Submit wholesale enquiry
                </button>
                <p className="mt-3 text-center text-[11px] text-[#999999]">
                  This will open WhatsApp with your wholesale order and business details
                </p>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
