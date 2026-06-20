import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/constants";
import type { OrderStatusHistory } from "@/types";

interface OrderTimelineProps {
  history: OrderStatusHistory[];
  className?: string;
}

export function OrderTimeline({ history, className }: OrderTimelineProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className={cn("space-y-0", className)}>
      {sortedHistory.map((entry, index) => {
        const isLast = index === sortedHistory.length - 1;

        return (
          <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-px bg-[#EAEAEA]" />
            )}

            {/* Dot */}
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 border-white shadow-sm",
                  index === 0 ? "bg-[#111111]" : "bg-[#CCCCCC]",
                )}
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 -mt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={entry.toStatus as Parameters<typeof StatusBadge>[0]["status"]}
                  type="order"
                />
                {entry.fromStatus && (
                  <span className="text-xs text-[#999999]">
                    from{" "}
                    <span className="font-medium text-[#666666]">
                      {entry.fromStatus.replace(/_/g, " ")}
                    </span>
                  </span>
                )}
              </div>
              {entry.notes && (
                <p className="mt-1.5 text-sm text-[#666666]">{entry.notes}</p>
              )}
              <div className="mt-1.5 flex items-center gap-2 text-xs text-[#999999]">
                <span>{formatDateTime(entry.createdAt)}</span>
                {entry.changedBy && (
                  <>
                    <span>·</span>
                    <span>{entry.changedBy.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
