"use client";

import * as React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/constants";
import { Plus, Search, MoreHorizontal, Pencil, Archive, Trash2, ImageIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const [search, setSearch] = React.useState("");

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku?.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <AdminHeader
        title="Products"
        actions={
          <Link href="/admin/products/new">
            <Button className="h-9 gap-2 rounded-[14px] bg-[#111111] px-4 text-sm font-medium text-white hover:bg-[#333333]">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
              <Input
                placeholder="Search products..."
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
                  <TableHead className="w-[60px] px-6 text-xs font-medium text-[#999999]">
                    Image
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Category
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Created
                  </TableHead>
                  <TableHead className="w-[50px] text-xs font-medium text-[#999999]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const primaryImage = product.images.find((img) => img.isPrimary);

                  return (
                    <TableRow
                      key={product.id}
                      className="group cursor-pointer hover:bg-[#FAFAFA]"
                    >
                      <TableCell className="px-6">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#F5F5F5]">
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={primaryImage.alt || product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-[#CCCCCC]" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#111111]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#999999]">{product.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#666666]">
                        {product.category?.name || "—"}
                      </TableCell>
                      <TableCell className="font-medium text-[#111111]">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} type="product" />
                      </TableCell>
                      <TableCell className="text-[#666666]">
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem className="gap-2 rounded-lg">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 rounded-lg">
                              <Archive className="h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 rounded-lg text-red-600 focus:text-red-600">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="mb-3 h-8 w-8 text-[#CCCCCC]" />
                <p className="text-sm font-medium text-[#666666]">
                  No products found
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
