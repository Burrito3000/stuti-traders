"use client";

import * as React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { dbGetCustomers } from "@/lib/db-simulator";
import { formatPrice, formatDate } from "@/lib/constants";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/types";

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [search, setSearch] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setCustomers(dbGetCustomers());
    setMounted(true);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search)
  );

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Customers"
        description="Manage customer profiles and activity"
        actions={
          <Button className="h-9 gap-2 rounded-[14px] bg-[#111111] px-4 text-sm font-medium text-white hover:bg-[#333333]">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-[12px] border-[#EAEAEA] bg-white pl-10 text-sm placeholder:text-[#999999] focus-visible:ring-[#111111]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-[20px] border border-[#EAEAEA] bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-6 text-xs font-medium text-[#999999]">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Phone
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Orders
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Revenue
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-[#999999]">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const initials = customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2);

                    return (
                      <TableRow
                        key={customer.id}
                        className="group cursor-pointer hover:bg-[#FAFAFA]"
                      >
                        <TableCell className="px-6 py-4">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="flex items-center gap-3"
                          >
                            <Avatar className="h-8 w-8 rounded-full border border-[#EAEAEA]">
                              <AvatarFallback className="text-[11px] font-semibold bg-[#111111]/5 text-[#111111] rounded-full">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-[#111111] hover:underline">
                              {customer.name}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-[#666666] py-4">
                          {customer.email ?? "—"}
                        </TableCell>
                        <TableCell className="text-[#666666] py-4">
                          {customer.phone ?? "—"}
                        </TableCell>
                        <TableCell className="text-[#666666] py-4">
                          {customer._count?.orders ?? 0} order{(customer._count?.orders ?? 0) === 1 ? "" : "s"}
                        </TableCell>
                        <TableCell className="font-medium text-[#111111] py-4">
                          {formatPrice(customer.totalRevenue ?? 0)}
                        </TableCell>
                        <TableCell className="text-[#666666] py-4">
                          {formatDate(customer.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
