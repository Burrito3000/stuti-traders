"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { PUBLIC_NAV_ITEMS, getWhatsAppUrl } from "@/lib/constants";
import { WhatsAppCTA } from "@/components/public/whatsapp-cta";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 h-[72px] w-full border-b border-border-default bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-heading text-[20px] font-bold tracking-tight text-text-primary">
          Stuti Traders
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <WhatsAppCTA className="h-9 px-4 py-2 text-[13px]" />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-[12px] text-text-primary transition-colors hover:bg-[#F5F5F5]"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="border-b border-border-default p-6">
                <SheetTitle className="font-heading text-lg font-bold tracking-tight">
                  Stuti Traders
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {PUBLIC_NAV_ITEMS.map((item) => (
                  <SheetClose key={item.href} render={<span />}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-[12px] px-4 py-3 text-base font-medium text-text-primary transition-colors hover:bg-[#F5F5F5]"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto border-t border-border-default p-4">
                <WhatsAppCTA variant="full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
