"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/public/product-card";
import { StaggerList, StaggerItem } from "@/components/motion/animations";
import { dbGetProducts, dbGetCategories } from "@/lib/db-simulator";
import type { Product, Category } from "@/types";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    // Dynamically sync with localStorage data simulator on mount
    const dbProds = dbGetProducts().filter((p) => p.status === "ACTIVE");
    const dbCats = dbGetCategories();
    if (dbProds.length > 0) setLocalProducts(dbProds);
    if (dbCats.length > 0) setLocalCategories(dbCats);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return localProducts;
    return localProducts.filter((p) => p.categoryId === activeCategory);
  }, [localProducts, activeCategory]);

  return (
    <div className="space-y-10">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-5 py-2.5 text-body-sm font-medium transition-all",
            activeCategory === "all"
              ? "bg-text-primary text-white shadow-sm"
              : "bg-[#F5F5F5] text-text-secondary hover:bg-[#EAEAEA] hover:text-text-primary"
          )}
        >
          All
        </button>
        {localCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "rounded-full px-5 py-2.5 text-body-sm font-medium transition-all",
              activeCategory === cat.id
                ? "bg-text-primary text-white shadow-sm"
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
