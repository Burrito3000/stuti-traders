"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockOrders } from "@/lib/mock-data";
import { formatPrice, formatDate, ORDER_STATUSES, type OrderStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusTabs: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Inquiry", value: "INQUIRY" },
  { label: "Quotation Sent", value: "QUOTATION_SENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter((order) => {
    const matchesTab = activeTab === "ALL" || order.status === activeTab;
    const matchesSearch =
      !search ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <AdminHeader
        title="Orders"
        description="Manage customer orders and inquiries"
        actions={
          <Link href="/admin/orders/new">
            <Button className="gap-2 rounded-[14px] bg-[#111111] text-white hover:bg-[#333]">
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-[14px] border border-[#EAEAEA] bg-white p-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`whitespace-nowrap rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-[#111111] text-white"
                    : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
            <Input
              placeholder="Search orders by number or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-[12px] border-[#EAEAEA] bg-white pl-10 text-sm placeholder:text-[#999999] focus-visible:ring-[#111111]"
            />
          </div>

          {/* Table */}
          <div className="mt-4 rounded-[20px] border border-[#EAEAEA] bg-white">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-6 text-xs font-medium text-[#999999]">Order #</TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">Customer</TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">Items</TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">Total</TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">Status</TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-[#999999]">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-[#FAFAFA]">
                      <TableCell className="px-6">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-[#111111] hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-[#666666]">
                        {order.customer?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-[#666666]">
                        {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? "item" : "items"}
                      </TableCell>
                      <TableCell className="font-medium text-[#111111]">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} type="order" />
                      </TableCell>
                      <TableCell className="text-[#666666]">
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
