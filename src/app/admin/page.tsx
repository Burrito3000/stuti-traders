"use client";

import { AdminHeader } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { StaggerList, StaggerItem } from "@/components/motion/animations";
import { mockDashboardStats } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/constants";
import { Package, Users, ShoppingCart, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <>
      <AdminHeader title="Dashboard" description="Overview of your business" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {/* Stat Cards */}
          <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StaggerItem>
              <StatCard
                icon={<Package className="h-5 w-5" />}
                value={stats.totalProducts}
                label="Total Products"
                trend={{ value: "+3", positive: true }}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={<Users className="h-5 w-5" />}
                value={stats.totalCustomers}
                label="Total Customers"
                trend={{ value: "+1", positive: true }}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={<ShoppingCart className="h-5 w-5" />}
                value={stats.totalOrders}
                label="Total Orders"
                trend={{ value: "+12%", positive: true }}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={<DollarSign className="h-5 w-5" />}
                value={formatPrice(stats.revenueThisMonth)}
                label="Revenue This Month"
                trend={{ value: "+8.2%", positive: true }}
              />
            </StaggerItem>
          </StaggerList>

          {/* Content Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Recent Orders */}
            <div className="col-span-1 xl:col-span-2">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] px-6 py-4">
                  <h2 className="text-sm font-semibold text-[#111111]">
                    Recent Orders
                  </h2>
                  <Link href="/admin/orders">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-xs text-[#666666] hover:text-[#111111]"
                    >
                      View all
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6 text-xs font-medium text-[#999999]">
                        Order
                      </TableHead>
                      <TableHead className="text-xs font-medium text-[#999999]">
                        Customer
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
                    {stats.recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-[#FAFAFA]"
                      >
                        <TableCell className="px-6 font-medium text-[#111111]">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </TableCell>
                        <TableCell className="text-[#666666]">
                          {order.customer?.name}
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
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-1">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="border-b border-[#EAEAEA] px-6 py-4">
                  <h2 className="text-sm font-semibold text-[#111111]">
                    Recent Activity
                  </h2>
                </div>
                <div className="p-3">
                  <ActivityFeed activities={stats.recentActivity} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
