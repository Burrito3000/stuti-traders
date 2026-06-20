"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#EAEAEA] bg-white px-6 lg:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight text-[#111111]">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 truncate text-sm text-[#666666]">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <Button
          variant="outline"
          className="hidden h-9 w-64 justify-start gap-2 rounded-xl border-[#EAEAEA] bg-[#FAFAFA] px-3 text-sm font-normal text-[#999999] hover:bg-[#F5F5F5] hover:text-[#666666] sm:flex"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            document.dispatchEvent(event);
          }}
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border border-[#EAEAEA] bg-white px-1.5 font-mono text-[10px] font-medium text-[#999999]">
            ⌘K
          </kbd>
        </Button>

        {/* Mobile search button */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-[#EAEAEA] sm:hidden"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            document.dispatchEvent(event);
          }}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Action slot */}
        {actions}
      </div>
    </header>
  );
}
