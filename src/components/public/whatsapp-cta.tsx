"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppCTAProps {
  productName?: string;
  variant?: "inline" | "full";
  className?: string;
}

export function WhatsAppCTA({
  productName,
  variant = "inline",
  className,
}: WhatsAppCTAProps) {
  const url = getWhatsAppUrl(productName);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-[14px] bg-[#25D366] px-6 py-3.5 font-heading text-[15px] font-semibold text-white transition-colors hover:bg-[#20BD5A]",
        variant === "full" && "w-full py-4 text-base",
        className
      )}
    >
      <MessageCircle className="size-5" />
      <span>Enquire on WhatsApp</span>
    </motion.a>
  );
}
