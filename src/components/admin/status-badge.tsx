import { cn } from "@/lib/utils";
import { ORDER_STATUSES, PRODUCT_STATUSES } from "@/lib/constants";
import type { Order, Product } from "@/types";

type OrderStatusKey = Order["status"];
type ProductStatusKey = Product["status"];

interface StatusBadgeProps {
  status: OrderStatusKey | ProductStatusKey;
  type?: "order" | "product";
  className?: string;
}

export function StatusBadge({ status, type = "order", className }: StatusBadgeProps) {
  const config =
    type === "order"
      ? ORDER_STATUSES[status as OrderStatusKey]
      : PRODUCT_STATUSES[status as ProductStatusKey];

  if (!config) return null;

  const dotColor =
    type === "order"
      ? (ORDER_STATUSES[status as OrderStatusKey] as { dot?: string }).dot
      : status === "ACTIVE"
        ? "bg-emerald-500"
        : status === "DRAFT"
          ? "bg-gray-400"
          : "bg-amber-500";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-xs font-medium",
        config.color,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      {config.label}
    </span>
  );
}
