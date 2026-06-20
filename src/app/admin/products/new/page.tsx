"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { dbGetCategories, dbSaveProduct } from "@/lib/db-simulator";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface Specification {
  id: string;
  key: string;
  value: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [status, setStatus] = React.useState("DRAFT");
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const [specifications, setSpecifications] = React.useState<Specification[]>([
    { id: "spec-1", key: "", value: "" },
  ]);

  // Validation state
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    setCategories(dbGetCategories());
  }, []);

  // Auto-generate slug from name
  React.useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  const addSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      { id: `spec-${Date.now()}`, key: "", value: "" },
    ]);
  };

  const removeSpecification = (id: string) => {
    setSpecifications((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSpecification = (
    id: string,
    field: "key" | "value",
    value: string,
  ) => {
    setSpecifications((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Valid price is required";
    if (!categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (publishStatus: string) => {
    if (!validate()) return;

    const specRecord: Record<string, string> = {};
    specifications.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specRecord[s.key.trim()] = s.value.trim();
      }
    });

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      slug,
      sku: sku || null,
      description: description || null,
      price: parseFloat(price),
      categoryId,
      category: selectedCategory
        ? {
            id: selectedCategory.id,
            name: selectedCategory.name,
            slug: selectedCategory.slug,
            description: null,
            imageUrl: null,
            sortOrder: 0,
          }
        : null,
      status: publishStatus as any,
      specifications: Object.keys(specRecord).length > 0 ? specRecord : null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      images: [
        {
          id: `img-${Date.now()}`,
          productId: `prod-${Date.now()}`,
          url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
          alt: name,
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbSaveProduct(newProduct);

    toast.success(
      publishStatus === "ACTIVE"
        ? "Product published successfully"
        : "Product saved as draft"
    );
    router.push("/admin/products");
  };

  return (
    <>
      <AdminHeader
        title="New Product"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-[14px] border-[#EAEAEA] text-sm"
              onClick={() => handleSubmit("DRAFT")}
            >
              Save as Draft
            </Button>
            <Button
              className="h-9 rounded-[14px] bg-[#111111] px-4 text-sm font-medium text-white hover:bg-[#333333]"
              onClick={() => handleSubmit("ACTIVE")}
            >
              Publish
            </Button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
          {/* Back link */}
          <Link
            href="/admin/products"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#666666] transition-colors hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <div className="space-y-8">
            {/* Basic Info */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6">
              <h2 className="text-sm font-semibold text-[#111111]">
                Basic Information
              </h2>
              <p className="mt-1 text-xs text-[#999999]">
                Add the core details of your product
              </p>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-[#111111]">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Aria Modular Sofa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111] ${errors.name ? "border-red-400" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium text-[#111111]">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-name"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="h-10 rounded-[12px] border-[#EAEAEA] text-sm text-[#666666] focus-visible:ring-[#111111]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-medium text-[#111111]">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      placeholder="e.g. SOF-001"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-[#111111]"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Write a detailed product description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-[#111111]">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#999999]">
                        ₹
                      </span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`h-10 rounded-[12px] border-[#EAEAEA] pl-7 text-sm focus-visible:ring-[#111111] ${errors.price ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-red-500">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#111111]">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger
                        className={`h-10 rounded-[12px] border-[#EAEAEA] text-sm focus:ring-[#111111] ${errors.categoryId ? "border-red-400" : ""}`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-xs text-red-500">{errors.categoryId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#111111]">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus:ring-[#111111]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="DRAFT" className="rounded-lg">
                          Draft
                        </SelectItem>
                        <SelectItem value="ACTIVE" className="rounded-lg">
                          Active
                        </SelectItem>
                        <SelectItem value="ARCHIVED" className="rounded-lg">
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6">
              <h2 className="text-sm font-semibold text-[#111111]">Images</h2>
              <p className="mt-1 text-xs text-[#999999]">
                Upload product images (JPEG, PNG, WebP up to 5MB)
              </p>

              <div className="mt-6">
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="group flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-[#EAEAEA] bg-[#FAFAFA] transition-colors hover:border-[#CCCCCC] hover:bg-[#F5F5F5]"
                  >
                    <Upload className="h-5 w-5 text-[#CCCCCC] transition-colors group-hover:text-[#999999]" />
                    <span className="text-xs text-[#999999]">Upload</span>
                  </button>

                  {/* Placeholder slots */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex h-32 w-32 items-center justify-center rounded-[16px] border border-[#EAEAEA] bg-[#FAFAFA]"
                    >
                      <ImageIcon className="h-6 w-6 text-[#E0E0E0]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#111111]">
                    Specifications
                  </h2>
                  <p className="mt-1 text-xs text-[#999999]">
                    Add key-value specification pairs
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-[10px] border-[#EAEAEA] text-xs"
                  onClick={addSpecification}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                {specifications.map((spec) => (
                  <div key={spec.id} className="flex items-center gap-3">
                    <Input
                      placeholder="Key (e.g. Material)"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(spec.id, "key", e.target.value)
                      }
                      className="h-10 flex-1 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                    />
                    <Input
                      placeholder="Value (e.g. Solid Oak)"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(spec.id, "value", e.target.value)
                      }
                      className="h-10 flex-1 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-lg text-[#999999] hover:text-red-500"
                      onClick={() => removeSpecification(spec.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6">
              <h2 className="text-sm font-semibold text-[#111111]">
                SEO Settings
              </h2>
              <p className="mt-1 text-xs text-[#999999]">
                Optimize how this product appears in search results
              </p>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="seoTitle"
                    className="text-sm font-medium text-[#111111]"
                  >
                    SEO Title
                  </Label>
                  <Input
                    id="seoTitle"
                    placeholder="Product Name — Category | Stuti Traders"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                  />
                  <p className="text-xs text-[#999999]">
                    {seoTitle.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="seoDescription"
                    className="text-sm font-medium text-[#111111]"
                  >
                    SEO Description
                  </Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="Write a concise product description for search engines..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    className="rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                  />
                  <p className="text-xs text-[#999999]">
                    {seoDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <Button
                variant="outline"
                className="h-10 rounded-[14px] border-[#EAEAEA] px-6 text-sm"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-[14px] border-[#EAEAEA] px-6 text-sm"
                onClick={() => handleSubmit("DRAFT")}
              >
                Save as Draft
              </Button>
              <Button
                className="h-10 rounded-[14px] bg-[#111111] px-6 text-sm font-medium text-white hover:bg-[#333333]"
                onClick={() => handleSubmit("ACTIVE")}
              >
                Publish Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
