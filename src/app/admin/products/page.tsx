"use client";

import * as React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { StatusBadge } from "@/components/admin/status-badge";
import { dbGetProducts, dbDeleteProduct, dbSaveProduct } from "@/lib/db-simulator";
import { formatPrice, formatDate } from "@/lib/constants";
import { Plus, Search, MoreHorizontal, Pencil, Archive, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [search, setSearch] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setProducts(dbGetProducts());
    setMounted(true);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku?.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    dbDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const handleToggleStatus = (product: Product, newStatus: "DRAFT" | "ACTIVE" | "ARCHIVED") => {
    const updated = { ...product, status: newStatus, updatedAt: new Date().toISOString() };
    dbSaveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    toast.success(`Product status updated to ${newStatus}`);
  };

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
          <div className="rounded-[20px] border border-[#EAEAEA] bg-white overflow-hidden shadow-sm">
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
                  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

                  return (
                    <TableRow
                      key={product.id}
                      className="group cursor-pointer hover:bg-[#FAFAFA]"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#F5F5F5] border border-[#EAEAEA]">
                          {primaryImage?.url ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt ?? product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#CCCCCC]">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-[#111111] py-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          {product.sku && (
                            <p className="mt-0.5 text-xs text-[#999999]">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#666666] py-4">
                        {product.category?.name ?? "Uncategorised"}
                      </TableCell>
                      <TableCell className="font-medium text-[#111111] py-4">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={product.status} type="product" />
                      </TableCell>
                      <TableCell className="text-[#666666] py-4">
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex h-8 w-8 p-0 rounded-full hover:bg-[#EAEAEA]"
                            >
                              <MoreHorizontal className="h-4 w-4 text-[#666666]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-[12px] border border-[#EAEAEA] bg-white p-1">
                            <DropdownMenuItem
                              onClick={() => {
                                handleToggleStatus(
                                  product,
                                  product.status === "ACTIVE" ? "DRAFT" : "ACTIVE"
                                );
                              }}
                              className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] cursor-pointer"
                            >
                              <Archive className="h-3.5 w-3.5" />
                              {product.status === "ACTIVE" ? "Save as Draft" : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 border-t border-[#EAEAEA]" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete product
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
