"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/status-badge";
import { dbGetCustomers, dbGetOrders } from "@/lib/db-simulator";
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
import { Customer, Order } from "@/types";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = React.useState<Order[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const allCustomers = dbGetCustomers();
    const foundCustomer = allCustomers.find((c) => c.id === customerId);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
      const allOrders = dbGetOrders();
      const filteredOrders = allOrders.filter((o) => o.customerId === foundCustomer.id);
      setCustomerOrders(filteredOrders);
    }
    setMounted(true);
  }, [customerId]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6 lg:p-8 text-center py-24">
          <p className="text-sm text-[#999999]">Customer profile not found.</p>
          <Link href="/admin/customers" className="mt-4 inline-block text-sm text-[#111111] hover:underline">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const totalRevenue = customerOrders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "INQUIRY")
    .reduce((sum, o) => sum + o.total, 0);

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
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 border border-[#EAEAEA]">
                    <AvatarFallback className="bg-[#111111] text-lg font-medium text-white rounded-full">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-lg font-semibold text-[#111111]">
                    {customer.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#999999]">
                    Customer since {formatDate(customer.createdAt)}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {customer.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#999999]" />
                      <div>
                        <p className="text-xs text-[#999999]">Email</p>
                        <p className="text-sm text-[#111111] break-all">{customer.email}</p>
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
                        <p className="text-xs text-[#999999]">Billing/Shipping Address</p>
                        <p className="text-sm text-[#111111] leading-relaxed">
                          {customer.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {customer.notes && (
                    <div className="flex items-start gap-3 border-t border-[#F5F5F5] pt-4">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#999999]" />
                      <div>
                        <p className="text-xs text-[#999999]">Operational Notes</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#666666]">
                          {customer.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and Order History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stat Blocks */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Orders Count
                    </span>
                    <ShoppingCart className="h-4 w-4 text-[#999999]" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-[#111111]">
                    {customerOrders.length}
                  </p>
                </div>

                <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Total Business
                    </span>
                    <DollarSign className="h-4 w-4 text-[#999999]" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-[#111111]">
                    {formatPrice(totalRevenue)}
                  </p>
                </div>
              </div>

              {/* Order History Table */}
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white overflow-hidden shadow-sm">
                <div className="border-b border-[#EAEAEA] px-6 py-4">
                  <h3 className="text-sm font-semibold text-[#111111]">Order History</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6 text-xs font-medium text-[#999999]">Order #</TableHead>
                      <TableHead className="text-xs font-medium text-[#999999]">Date</TableHead>
                      <TableHead className="text-xs font-medium text-[#999999]">Status</TableHead>
                      <TableHead className="text-right text-xs font-medium text-[#999999]">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-sm text-[#999999]">
                          No orders placed by this customer.
                        </TableCell>
                      </TableRow>
                    ) : (
                      customerOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-[#FAFAFA]"
                        >
                          <TableCell className="px-6 py-4 font-medium text-[#111111]">
                            <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                              {order.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-[#666666] py-4">
                            {formatDateTime(order.createdAt)}
                          </TableCell>
                          <TableCell className="py-4">
                            <StatusBadge status={order.status} type="order" />
                          </TableCell>
                          <TableCell className="text-right font-medium text-[#111111] py-4">
                            {formatPrice(order.total)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
