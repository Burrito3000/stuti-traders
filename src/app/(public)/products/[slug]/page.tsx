import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/constants";
import { FadeInView, StaggerList, StaggerItem } from "@/components/motion/animations";
import { AddToCartButton } from "@/components/public/add-to-cart-button";
import { ProductCard } from "@/components/public/product-card";
import { ProductGallery } from "./gallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description ?? undefined,
    openGraph: {
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? product.description ?? undefined,
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.images[0].alt ?? product.name }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) notFound();

  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  // If not enough related products in same category, fill with others
  const moreProducts =
    relatedProducts.length < 3
      ? [
          ...relatedProducts,
          ...mockProducts
            .filter(
              (p) =>
                p.id !== product.id &&
                !relatedProducts.some((r) => r.id === p.id)
            )
            .slice(0, 3 - relatedProducts.length),
        ]
      : relatedProducts;

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <FadeInView>
          <nav className="flex items-center gap-1.5 text-body-sm text-text-tertiary">
            <Link
              href="/"
              className="transition-colors hover:text-text-secondary"
            >
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href="/products"
              className="transition-colors hover:text-text-secondary"
            >
              Products
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-text-primary font-medium">{product.name}</span>
          </nav>
        </FadeInView>
      </div>

      {/* Product Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <FadeInView direction="left">
            <ProductGallery images={product.images} productName={product.name} />
          </FadeInView>

          {/* Details */}
          <FadeInView direction="right" delay={0.1}>
            <div className="flex flex-col lg:sticky lg:top-[96px]">
              {product.category && (
                <span className="text-caption text-text-tertiary">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-display-lg font-heading text-text-primary mt-2">
                {product.name}
              </h1>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-[#111111]/5 px-3 py-1.5 text-xs font-semibold text-[#111111]">
                  Wholesale Only — Pricing on Enquiry
                </span>
              </div>

              {product.description && (
                <p className="mt-6 text-body-lg leading-relaxed text-text-secondary">
                  {product.description}
                </p>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-10">
                  <h3 className="text-heading-md font-heading text-text-primary">
                    Specifications
                  </h3>
                  <div className="mt-4 divide-y divide-border-default">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-baseline justify-between py-3"
                      >
                        <span className="text-body-sm text-text-secondary">
                          {key}
                        </span>
                        <span className="text-body-sm font-medium text-text-primary text-right ml-4">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="mt-6 text-body-sm text-text-tertiary">
                  SKU: {product.sku}
                </p>
              )}

              {/* CTA */}
              <div className="mt-10">
                <AddToCartButton product={product} variant="full" />
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Related Products */}
      {moreProducts.length > 0 && (
        <section className="border-t border-border-default bg-surface py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInView>
              <span className="text-caption text-text-tertiary">
                You may also like
              </span>
              <h2 className="text-display-md font-heading text-text-primary mt-3">
                Related Products
              </h2>
            </FadeInView>

            <StaggerList className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreProducts.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>
      )}
    </div>
  );
}
