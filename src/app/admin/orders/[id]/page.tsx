"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Package, FileText, Calendar } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrderTimeline } from "@/components/admin/order-timeline";
import { dbGetOrders, dbSaveOrder } from "@/lib/db-simulator";
import { formatPrice, formatDate, ORDER_STATUSES, type OrderStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order, OrderStatusHistory } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const orders = dbGetOrders();
    const foundOrder = orders.find((o) => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setMounted(true);
  }, [id]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
      </div>
    );
  }

  if (!order) notFound();

  const nextStatuses: Record<string, OrderStatus[]> = {
    INQUIRY: ["QUOTATION_SENT", "CANCELLED"],
    QUOTATION_SENT: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  const availableTransitions = nextStatuses[order.status] || [];

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    const historyEntry: OrderStatusHistory = {
      id: `hist-${Date.now()}`,
      orderId: order.id,
      fromStatus: order.status,
      toStatus: newStatus,
      notes: `Status changed from ${ORDER_STATUSES[order.status].label} to ${ORDER_STATUSES[newStatus].label}.`,
      createdAt: new Date().toISOString(),
      changedBy: { name: "Admin" },
    };

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      statusHistory: [historyEntry, ...(order.statusHistory || [])],
      updatedAt: new Date().toISOString(),
    };

    dbSaveOrder(updatedOrder);
    setOrder(updatedOrder);
    toast.success(`Order status updated to ${ORDER_STATUSES[newStatus].label}`);
  };

  return (
    <>
      <AdminHeader
        title={
          <div className="flex items-center gap-3">
            <span>{order.orderNumber}</span>
            <StatusBadge status={order.status} type="order" />
          </div>
        }
        description={`Created ${formatDate(order.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/orders">
              <Button variant="ghost" className="gap-2 rounded-[14px] text-[#666666] hover:text-[#111111]">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            {availableTransitions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 rounded-[14px] bg-[#111111] text-white hover:bg-[#333]">
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[12px] border-[#EAEAEA] bg-white p-1 shadow-md">
                  {availableTransitions.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      className="rounded-[8px] cursor-pointer flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#F5F5F5]"
                    >
                      <span className={`inline-block h-2 w-2 rounded-full ${ORDER_STATUSES[status].dot}`} />
                      {ORDER_STATUSES[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Main Content */}
            <div className="col-span-1 space-y-6 xl:col-span-2">
              {/* Customer Card */}
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]">
                    <User className="h-5 w-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">Customer</h3>
                    <p className="text-sm text-[#666666]">{order.customer?.name}</p>
                  </div>
                </div>
                {order.customer && (
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {order.customer.email && (
                      <div>
                        <span className="text-[#999999] text-xs">Email</span>
                        <p className="mt-0.5 text-[#111111]">{order.customer.email}</p>
                      </div>
                    )}
                    {order.customer.phone && (
                      <div>
                        <span className="text-[#999999] text-xs">Phone</span>
                        <p className="mt-0.5 text-[#111111]">{order.customer.phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#EAEAEA] px-6 py-4">
                  <Package className="h-4 w-4 text-[#999999]" />
                  <h3 className="text-sm font-semibold text-[#111111]">Order Items</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6 text-xs font-medium text-[#999999]">Product</TableHead>
                      <TableHead className="text-xs font-medium text-[#999999]">Qty</TableHead>
                      <TableHead className="text-xs font-medium text-[#999999]">Unit Price</TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#999999]">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items?.map((item) => (
                      <TableRow key={item.id} className="hover:bg-[#FAFAFA]">
                        <TableCell className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#111111]">{item.product?.name ?? "—"}</p>
                            {item.notes && (
                              <p className="mt-0.5 text-xs text-[#999999]">{item.notes}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-[#666666] py-4">{item.quantity}</TableCell>
                        <TableCell className="text-[#666666] py-4">{formatPrice(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-medium text-[#111111] py-4">
                          {formatPrice(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Totals */}
                <div className="border-t border-[#EAEAEA] px-6 py-4 bg-[#FAFAFA]/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#666666]">Subtotal</span>
                    <span className="text-sm text-[#111111]">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-[#EAEAEA] pt-3">
                    <span className="text-sm font-semibold text-[#111111]">Total Value</span>
                    <span className="text-lg font-bold text-[#111111]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-[#999999]" />
                    <h3 className="text-sm font-semibold text-[#111111]">Notes</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#666666]">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Sidebar — Status History */}
            <div className="col-span-1">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#EAEAEA] px-6 py-4">
                  <Calendar className="h-4 w-4 text-[#999999]" />
                  <h3 className="text-sm font-semibold text-[#111111]">Status History</h3>
                </div>
                <div className="p-6">
                  <OrderTimeline history={order.statusHistory ?? []} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
