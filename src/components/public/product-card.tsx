"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block space-y-4">
        {/* Image */}
        <motion.div
          variants={{
            rest: { boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
            hover: { boxShadow: "0 8px 24px rgba(0,0,0,0.08)", y: -4 },
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#F5F5F5]"
        >
          {primaryImage && (
            <motion.div
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Info */}
        <div className="space-y-1.5 px-1">
          <h3 className="font-heading text-base font-semibold text-text-primary leading-snug">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-body-sm text-text-secondary">
              {product.category.name}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="font-heading text-base font-semibold text-text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="inline-flex items-center gap-1 text-body-sm font-medium text-text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View Product
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
