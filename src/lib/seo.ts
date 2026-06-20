import { Metadata } from "next";
import { APP_NAME } from "./constants";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function generateProductMetadata(product: {
  name: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  description?: string | null;
  slug: string;
  images?: { url: string; alt?: string | null }[];
}): Metadata {
  const title = product.seoTitle || `${product.name} | ${APP_NAME}`;
  const description =
    product.seoDescription ||
    product.description?.slice(0, 160) ||
    `Discover ${product.name} at ${APP_NAME}`;
  const primaryImage = product.images?.[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${APP_URL}/products/${product.slug}`,
      images: primaryImage ? [{ url: primaryImage, alt: product.name }] : [],
      siteName: APP_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

export function generateCategoryMetadata(category: {
  name: string;
  description?: string | null;
  slug: string;
}): Metadata {
  const title = `${category.name} | ${APP_NAME}`;
  const description =
    category.description || `Browse our ${category.name} collection at ${APP_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${APP_URL}/categories/${category.slug}`,
      siteName: APP_NAME,
    },
  };
}

export function generateProductStructuredData(product: {
  name: string;
  description?: string | null;
  price: number;
  slug: string;
  images?: { url: string }[];
  sku?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img) => img.url),
    sku: product.sku,
    url: `${APP_URL}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}
