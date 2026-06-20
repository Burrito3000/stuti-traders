"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockCustomers, mockOrders } from "@/lib/mock-data";
import { formatPrice, formatDate, formatDateTime } from "@/lib/constants";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const customer =
    mockCustomers.find((c) => c.id === customerId) || mockCustomers[0];
  const customerOrders = mockOrders.filter(
    (o) => o.customerId === customer.id,
  );

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const totalRevenue = customerOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <AdminHeader title={customer.name} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6 lg:p-8">
          {/* Back link */}
          <Link
            href="/admin/customers"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#666666] transition-colors hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Customer Details Card */}
            <div className="lg:col-span-1">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-[#111111] text-lg font-medium text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-lg font-semibold text-[#111111]">
                    {customer.name}
                  </h2>
                  <p className="mt-1 text-sm text-[#666666]">
                    Customer since {formatDate(customer.createdAt)}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {customer.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#999999]" />
                      <div>
                        <p className="text-xs text-[#999999]">Email</p>
                        <p className="text-sm text-[#111111]">{customer.email}</p>
                      </div>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#999999]" />
                      <div>
                        <p className="text-xs text-[#999999]">Phone</p>
                        <p className="text-sm text-[#111111]">{customer.phone}</p>
                      </div>
                    </div>
                  )}

                  {customer.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#999999]" />
                      <div>
                        <p className="text-xs text-[#999999]">Address</p>
                        <p className="text-sm text-[#111111]">
                          {customer.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {customer.notes && (
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#999999]" />
                      <div>
                        <p className="text-xs text-[#999999]">Notes</p>
                        <p className="text-sm text-[#666666]">
                          {customer.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#FAFAFA] p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[#999999]">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span className="text-xs">Orders</span>
                    </div>
                    <p className="mt-1 text-xl font-semibold text-[#111111]">
                      {customerOrders.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FAFAFA] p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[#999999]">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="text-xs">Revenue</span>
                    </div>
                    <p className="mt-1 text-xl font-semibold text-[#111111]">
                      {formatPrice(totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="border-b border-[#EAEAEA] px-6 py-4">
                  <h2 className="text-sm font-semibold text-[#111111]">
                    Order History
                  </h2>
                  <p className="mt-0.5 text-xs text-[#999999]">
                    All orders placed by this customer
                  </p>
                </div>

                {customerOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-6 text-xs font-medium text-[#999999]">
                          Order
                        </TableHead>
                        <TableHead className="text-xs font-medium text-[#999999]">
                          Items
                        </TableHead>
                        <TableHead className="text-xs font-medium text-[#999999]">
                          Total
                        </TableHead>
                        <TableHead className="text-xs font-medium text-[#999999]">
                          Status
                        </TableHead>
                        <TableHead className="text-xs font-medium text-[#999999]">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-[#FAFAFA]"
                        >
                          <TableCell className="px-6">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-medium text-[#111111] hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-[#666666]">
                            {order.items?.length || 0} item
                            {(order.items?.length || 0) !== 1 ? "s" : ""}
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
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <ShoppingCart className="mb-3 h-8 w-8 text-[#CCCCCC]" />
                    <p className="text-sm font-medium text-[#666666]">
                      No orders yet
                    </p>
                    <p className="mt-1 text-xs text-[#999999]">
                      This customer hasn&apos;t placed any orders
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
