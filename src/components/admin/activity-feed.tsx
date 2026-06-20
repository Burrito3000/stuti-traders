import { cn } from "@/lib/utils";
import { Package, ShoppingCart, Users, Settings, FileText } from "lucide-react";
import type { ActivityLog } from "@/types";

interface ActivityFeedProps {
  activities: ActivityLog[];
  className?: string;
}

function getActivityIcon(entityType: string) {
  switch (entityType) {
    case "product":
      return <Package className="h-4 w-4" />;
    case "order":
      return <ShoppingCart className="h-4 w-4" />;
    case "customer":
      return <Users className="h-4 w-4" />;
    case "settings":
      return <Settings className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getActivityDescription(activity: ActivityLog): string {
  const user = activity.user?.name || "System";
  const metadata = activity.metadata as Record<string, string> | null;

  switch (activity.action) {
    case "created":
      return `${user} created ${activity.entityType} ${metadata?.orderNumber || metadata?.name || ""}`;
    case "updated_status":
      return `${user} updated ${activity.entityType} status from ${metadata?.from} to ${metadata?.to}`;
    case "updated":
      return `${user} updated ${activity.entityType} ${metadata?.name || ""}`;
    case "deleted":
      return `${user} deleted ${activity.entityType} ${metadata?.name || ""}`;
    default:
      return `${user} performed ${activity.action} on ${activity.entityType}`;
  }
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getEntityColor(entityType: string) {
  switch (entityType) {
    case "product":
      return "bg-blue-50 text-blue-600";
    case "order":
      return "bg-purple-50 text-purple-600";
    case "customer":
      return "bg-emerald-50 text-emerald-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[#FAFAFA]">
          <div className="relative flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                getEntityColor(activity.entityType),
              )}
            >
              {getActivityIcon(activity.entityType)}
            </div>
            {index < activities.length - 1 && (
              <div className="mt-1 h-full w-px bg-[#EAEAEA]" />
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm text-[#111111] leading-snug">
              {getActivityDescription(activity)}
            </p>
            <p className="mt-1 text-xs text-[#999999]">
              {getRelativeTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
