"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/public/product-card";
import { StaggerList, StaggerItem } from "@/components/motion/animations";
import type { Product, Category } from "@/types";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.categoryId === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="space-y-10">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-5 py-2.5 text-body-sm font-medium transition-all",
            activeCategory === "all"
              ? "bg-text-primary text-white"
              : "bg-[#F5F5F5] text-text-secondary hover:bg-[#EAEAEA] hover:text-text-primary"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "rounded-full px-5 py-2.5 text-body-sm font-medium transition-all",
              activeCategory === cat.id
                ? "bg-text-primary text-white"
                : "bg-[#F5F5F5] text-text-secondary hover:bg-[#EAEAEA] hover:text-text-primary"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <StaggerList className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerList>

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-body-lg text-text-secondary">
                No products found in this category.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
