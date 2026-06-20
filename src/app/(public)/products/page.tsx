import type { Metadata } from "next";
import { FadeInView } from "@/components/motion/animations";
import { ProductGrid } from "@/components/public/product-grid";
import { mockProducts, mockCategories } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Our Collection",
  description:
    "Browse our curated collection of premium furniture and design objects. From living room sofas to statement lighting — handcrafted for modern living.",
};

export default function ProductsPage() {
  const activeProducts = mockProducts.filter((p) => p.status === "ACTIVE");

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <FadeInView>
          <div className="max-w-2xl">
            <span className="text-caption text-text-tertiary">
              All Products
            </span>
            <h1 className="text-display-lg font-heading text-text-primary mt-3">
              Our Collection
            </h1>
            <p className="mt-4 text-body-lg text-text-secondary">
              Every piece in our catalog is selected for its craftsmanship,
              materiality, and timeless design. Browse by category or explore
              the full collection.
            </p>
          </div>
        </FadeInView>

        {/* Grid */}
        <div className="mt-12 md:mt-16">
          <ProductGrid
            products={activeProducts}
            categories={mockCategories}
          />
        </div>
      </div>
    </div>
  );
}
