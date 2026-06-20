"use client";

import * as React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { mockCustomers } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/constants";
import { Plus, Search, Mail, Phone } from "lucide-react";
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

export default function CustomersPage() {
  const [search, setSearch] = React.useState("");

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search),
  );

  return (
    <>
      <AdminHeader
        title="Customers"
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
          <div className="rounded-[20px] border border-[#EAEAEA] bg-white">
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
                {filteredCustomers.map((customer) => {
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
                      <TableCell className="px-6">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#F5F5F5] text-[10px] font-medium text-[#666666]">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-[#111111] group-hover:underline">
                            {customer.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[#666666]">
                          <Mail className="h-3.5 w-3.5 text-[#999999]" />
                          {customer.email || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[#666666]">
                          <Phone className="h-3.5 w-3.5 text-[#999999]" />
                          {customer.phone || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-[#111111]">
                        {customer._count?.orders || 0}
                      </TableCell>
                      <TableCell className="font-medium text-[#111111]">
                        {formatPrice(customer.totalRevenue || 0)}
                      </TableCell>
                      <TableCell className="text-[#666666]">
                        {formatDate(customer.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredCustomers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="mb-3 h-8 w-8 text-[#CCCCCC]" />
                <p className="text-sm font-medium text-[#666666]">
                  No customers found
                </p>
                <p className="mt-1 text-xs text-[#999999]">
                  Try adjusting your search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
