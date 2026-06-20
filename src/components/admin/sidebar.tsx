"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ADMIN_NAV_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  ShoppingCart: <ShoppingCart className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
};

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("stuti_admin_logged_in");
    toast.success("Logged out successfully");
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <span className="text-lg font-semibold tracking-tight text-[#111111]">
          Stuti
        </span>
        <span className="rounded-md bg-[#111111] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-[#F5F5F5] text-[#111111]"
                  : "text-[#666666] hover:bg-[#FAFAFA] hover:text-[#111111]",
              )}
            >
              <span
                className={cn(
                  "transition-colors duration-150",
                  isActive
                    ? "text-[#111111]"
                    : "text-[#999999] group-hover:text-[#666666]",
                )}
              >
                {iconMap[item.icon]}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[#EAEAEA] p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#111111] text-[10px] font-medium text-white">
              ST
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#111111]">
              Admin User
            </p>
            <p className="truncate text-xs text-[#999999]">admin@stutitraders.com</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-[#999999] hover:text-[#111111]"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-[280px] shrink-0 border-r border-[#EAEAEA] bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 top-4 z-40 h-10 w-10 rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-[#EAEAEA] lg:hidden"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0" showCloseButton={true}>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Admin navigation menu
            </SheetDescription>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
