"use client";

import * as React from "react";
import { AdminHeader } from "@/components/admin/header";
import { mockCategories } from "@/lib/mock-data";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Layers, ImageIcon } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryData[]>(mockCategories);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryData | null>(null);

  // Form State
  const [form, setForm] = React.useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
  });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
  );

  React.useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || "",
        imageUrl: editingCategory.imageUrl || "",
        sortOrder: editingCategory.sortOrder,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        sortOrder: categories.length,
      });
    }
  }, [editingCategory, dialogOpen, categories.length]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingCategory) {
      // Edit
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: form.name,
                slug: form.slug,
                description: form.description || null,
                imageUrl: form.imageUrl || null,
                sortOrder: Number(form.sortOrder),
              }
            : cat
        )
      );
      toast.success("Category updated successfully");
    } else {
      // Create new
      const newCategory: CategoryData = {
        id: `cat-${Date.now()}`,
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
        sortOrder: Number(form.sortOrder),
        _count: { products: 0 },
      };
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Category created successfully");
    }

    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Category deleted successfully");
  };

  return (
    <>
      <AdminHeader
        title="Categories"
        actions={
          <Button
            onClick={() => {
              setEditingCategory(null);
              setDialogOpen(true);
            }}
            className="h-9 gap-2 rounded-[14px] bg-[#111111] px-4 text-sm font-medium text-white hover:bg-[#333333]"
          >
            <Plus className="h-4 w-4" />
            Add Category
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
                placeholder="Search categories..."
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
                  <TableHead className="w-[80px] px-6 text-xs font-medium text-[#999999]">
                    Image
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Slug
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Products Count
                  </TableHead>
                  <TableHead className="text-xs font-medium text-[#999999]">
                    Sort Order
                  </TableHead>
                  <TableHead className="w-[50px] text-xs font-medium text-[#999999]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-[#999999]">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="group cursor-pointer hover:bg-[#FAFAFA]"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-[10px] bg-[#F5F5F5] border border-[#EAEAEA]">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#CCCCCC]">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-[#111111] py-4">
                        <div>
                          <p className="font-semibold">{category.name}</p>
                          {category.description && (
                            <p className="mt-0.5 max-w-md truncate text-xs text-[#999999]">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#666666] py-4">
                        <code>{category.slug}</code>
                      </TableCell>
                      <TableCell className="text-sm text-[#666666] py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#111111]/5 px-2.5 py-0.5 text-xs font-medium text-[#111111]">
                          <Layers className="h-3 w-3" />
                          {category._count?.products ?? 0} products
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#111111] py-4">
                        {category.sortOrder}
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
                                setEditingCategory(category);
                                setDialogOpen(true);
                              }}
                              className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 border-t border-[#EAEAEA]" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(category.id)}
                              className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px] border border-[#EAEAEA] bg-white p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-[#111111]">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#999999]">
              {editingCategory
                ? "Modify category information below."
                : "Create a new product category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Category Name *
              </label>
              <Input
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Kitchen Accessories"
                className="h-10 rounded-[12px] border-[#EAEAEA] bg-white text-sm focus-visible:ring-[#111111]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Slug *
              </label>
              <Input
                value={form.slug}
                readOnly
                placeholder="slug-auto-generated"
                className="h-10 rounded-[12px] border-[#EAEAEA] bg-gray-50 text-sm cursor-not-allowed focus-visible:ring-[#111111]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what items belong in this category..."
                className="rounded-[12px] border-[#EAEAEA] bg-white text-sm focus-visible:ring-[#111111] resize-none"
                rows={3}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Image URL
              </label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Paste an Unsplash image URL..."
                className="h-10 rounded-[12px] border-[#EAEAEA] bg-white text-sm focus-visible:ring-[#111111]"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Sort Order (Position)
              </label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                className="h-10 rounded-[12px] border-[#EAEAEA] bg-white text-sm focus-visible:ring-[#111111]"
              />
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-[12px] border-[#EAEAEA] text-[#666666] hover:bg-[#F5F5F5]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-[12px] bg-[#111111] text-white hover:bg-[#333333]"
              >
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
