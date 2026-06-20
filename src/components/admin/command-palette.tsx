"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Package,
  Users,
  ShoppingCart,
  Settings,
  Plus,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { mockProducts, mockCustomers, mockOrders } from "@/lib/mock-data";
import { formatPrice } from "@/lib/constants";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search across products, customers, orders and actions"
    >
      <Command className="rounded-xl border-0">
        <CommandInput placeholder="Type to search..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Search className="h-8 w-8 text-[#CCCCCC]" />
              <p className="text-sm text-[#999999]">No results found.</p>
            </div>
          </CommandEmpty>

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/products/new"))}
            >
              <Plus className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Create new product</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/orders"))}
            >
              <Plus className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Create new order</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/customers"))}
            >
              <Plus className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Add new customer</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin"))}
            >
              <LayoutDashboard className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/products"))}
            >
              <Package className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Products</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/orders"))}
            >
              <ShoppingCart className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Orders</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/customers"))}
            >
              <Users className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Customers</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin/settings"))}
            >
              <Settings className="mr-2 h-4 w-4 text-[#666666]" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Products">
            {mockProducts.slice(0, 5).map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() =>
                  runCommand(() => router.push(`/admin/products`))
                }
              >
                <Package className="mr-2 h-4 w-4 text-[#666666]" />
                <div className="flex flex-1 items-center justify-between">
                  <span>{product.name}</span>
                  <span className="text-xs text-[#999999]">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Customers">
            {mockCustomers.map((customer) => (
              <CommandItem
                key={customer.id}
                onSelect={() =>
                  runCommand(() => router.push(`/admin/customers/${customer.id}`))
                }
              >
                <Users className="mr-2 h-4 w-4 text-[#666666]" />
                <div className="flex flex-1 items-center justify-between">
                  <span>{customer.name}</span>
                  <span className="text-xs text-[#999999]">{customer.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Orders">
            {mockOrders.map((order) => (
              <CommandItem
                key={order.id}
                onSelect={() =>
                  runCommand(() => router.push(`/admin/orders/${order.id}`))
                }
              >
                <ShoppingCart className="mr-2 h-4 w-4 text-[#666666]" />
                <div className="flex flex-1 items-center justify-between">
                  <span>
                    {order.orderNumber} — {order.customer?.name}
                  </span>
                  <span className="text-xs text-[#999999]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
