"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { StaggerList, StaggerItem } from "@/components/motion/animations";
import { dbGetDashboardStats } from "@/lib/db-simulator";
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
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData(dbGetDashboardStats());
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
      </div>
    );
  }

  const { stats, recentOrders, recentActivity } = data;

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
                trend={{ value: stats.productsTrend, positive: true }}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={<Users className="h-5 w-5" />}
                value={stats.totalCustomers}
                label="Total Customers"
                trend={{ value: stats.customersTrend, positive: true }}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={<ShoppingCart className="h-5 w-5" />}
                value={stats.totalOrders}
                label="Total Orders"
                trend={{ value: stats.ordersTrend, positive: true }}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={<DollarSign className="h-5 w-5" />}
                value={formatPrice(stats.monthlyRevenue)}
                label="Estimated Revenue"
                trend={{ value: stats.revenueTrend, positive: true }}
              />
            </StaggerItem>
          </StaggerList>

          {/* Content Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Recent Orders */}
            <div className="col-span-1 xl:col-span-2">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white overflow-hidden shadow-sm">
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
                    {recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-sm text-[#999999]">
                          No orders placed yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentOrders.map((order: any) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-[#FAFAFA]"
                        >
                          <TableCell className="px-6 py-4 font-medium text-[#111111]">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-[#666666] py-4">
                            {order.customer?.name}
                          </TableCell>
                          <TableCell className="font-medium text-[#111111] py-4">
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell className="py-4">
                            <StatusBadge status={order.status} type="order" />
                          </TableCell>
                          <TableCell className="text-[#666666] py-4">
                            {formatDate(order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-1">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-white overflow-hidden shadow-sm">
                <div className="border-b border-[#EAEAEA] px-6 py-4">
                  <h2 className="text-sm font-semibold text-[#111111]">
                    Recent Activity
                  </h2>
                </div>
                <div className="p-3">
                  {recentActivity.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#999999]">
                      No recent activities recorded.
                    </div>
                  ) : (
                    <ActivityFeed activities={recentActivity} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
