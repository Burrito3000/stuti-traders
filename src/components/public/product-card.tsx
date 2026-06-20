"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/constants";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
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
      </Link>

      {/* Info */}
      <div className="space-y-1.5 px-1 pt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading text-base font-semibold text-text-primary leading-snug hover:underline">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-body-sm text-text-secondary">
            {product.category.name}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider bg-[#F5F5F5] px-2 py-0.5 rounded-[6px]">
            Wholesale
          </span>
          <AddToCartButton product={product} variant="compact" />
        </div>
      </div>
    </motion.div>
  );
}
