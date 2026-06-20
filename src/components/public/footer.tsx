import Link from "next/link";
import { PUBLIC_NAV_ITEMS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border-default bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3 md:gap-8 md:py-20">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-heading text-xl font-bold tracking-tight text-text-primary"
            >
              Stuti Traders
            </Link>
            <p className="max-w-xs text-body-sm leading-relaxed text-text-secondary">
              Your trusted destination for premium household essentials —
              kitchenware, storage, cleaning, and home care products.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-caption text-text-tertiary">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-caption text-text-tertiary">Connect</h4>
            <nav className="flex flex-col gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                WhatsApp
              </a>
              <a
                href="mailto:hello@stutitraders.com"
                className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                hello@stutitraders.com
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-default py-8 text-body-sm text-text-tertiary md:flex-row">
          <p>&copy; {new Date().getFullYear()} Stuti Traders. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/products" className="transition-colors hover:text-text-secondary">
              Privacy Policy
            </Link>
            <Link href="/products" className="transition-colors hover:text-text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
