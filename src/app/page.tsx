import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ProductCard } from "@/components/public/product-card";
import { WhatsAppCTA } from "@/components/public/whatsapp-cta";
import { FadeInView, StaggerList, StaggerItem } from "@/components/motion/animations";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { getWhatsAppUrl } from "@/lib/constants";

const featuredProducts = mockProducts.slice(0, 4);

const testimonials = [
  {
    quote:
      "Stuti Traders has been our go-to for all kitchen supplies. The pressure cooker quality is outstanding and their prices are unbeatable. We've been ordering from them for 3 years now.",
    name: "Priya Sharma",
    role: "Home Chef, Mumbai",
  },
  {
    quote:
      "We furnished our entire hotel kitchen through Stuti Traders. From cookware to storage — everything was delivered on time and at wholesale rates. Excellent service!",
    name: "Rajesh Patel",
    role: "Hotel Owner, Ahmedabad",
  },
  {
    quote:
      "The product quality is consistently great and the WhatsApp ordering makes it so convenient. I've already recommended them to all my neighbours and relatives.",
    name: "Anita Verma",
    role: "Regular Customer, Noida",
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-background">
          {/* Subtle radial gradient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(17,17,17,0.04),transparent)]" />

          <FadeInView className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <span className="text-caption text-text-tertiary mb-6 inline-block">
              Trusted Household Essentials
            </span>
            <h1 className="text-display-xl font-heading text-text-primary mt-4">
              Everything Your
              <br />
              Home Needs
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-body-lg text-text-secondary">
              Premium kitchenware, storage solutions, cleaning essentials, and
              everyday household products — all in one place, at the best prices.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-[14px] bg-text-primary px-7 py-3.5 font-heading text-[15px] font-semibold text-white transition-colors hover:bg-[#333]"
              >
                Browse Products
                <ArrowRight className="size-4" />
              </Link>
              <WhatsAppCTA className="bg-transparent border border-border-default text-text-primary hover:bg-[#F5F5F5] hover:text-text-primary" />
            </div>
          </FadeInView>
        </section>

        {/* ─── FEATURED PRODUCTS ─── */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInView>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-caption text-text-tertiary">
                    Popular Items
                  </span>
                  <h2 className="text-display-md font-heading text-text-primary mt-3">
                    Bestselling Products
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden items-center gap-1.5 text-body-sm font-medium text-text-secondary transition-colors hover:text-text-primary sm:inline-flex"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </FadeInView>

            <StaggerList className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerList>

            <FadeInView className="mt-10 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                View all products
                <ArrowRight className="size-3.5" />
              </Link>
            </FadeInView>
          </div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="bg-surface py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInView>
              <span className="text-caption text-text-tertiary">
                Explore
              </span>
              <h2 className="text-display-md font-heading text-text-primary mt-3">
                Shop by Category
              </h2>
            </FadeInView>

            <StaggerList className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {mockCategories.map((category) => (
                <StaggerItem key={category.id}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-[24px]"
                  >
                    {category.imageUrl && (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h3 className="font-heading text-lg font-semibold text-white md:text-xl">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-body-sm text-white/70">
                        {category._count?.products ?? 0} products
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

        {/* ─── ABOUT / BRAND STORY ─── */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <FadeInView direction="left">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80"
                    alt="Stuti Traders — Our Store"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </FadeInView>

              <FadeInView direction="right" delay={0.15}>
                <div className="max-w-lg">
                  <span className="text-caption text-text-tertiary">
                    About Us
                  </span>
                  <h2 className="text-display-md font-heading text-text-primary mt-3">
                    Quality You Can
                    <br />
                    Trust
                  </h2>
                  <p className="mt-6 text-body-lg text-text-secondary leading-relaxed">
                    Stuti Traders has been serving households and businesses with
                    premium quality household essentials. We handpick every product
                    for its durability, functionality, and value for money.
                  </p>
                  <p className="mt-4 text-body-md text-text-secondary leading-relaxed">
                    From stainless steel kitchenware to smart storage solutions — 
                    we source directly from trusted manufacturers to bring you the
                    best products at wholesale prices. Your satisfaction is our
                    guarantee.
                  </p>
                  <Link
                    href="/products"
                    className="mt-8 inline-flex items-center gap-2 rounded-[14px] bg-text-primary px-6 py-3 font-heading text-[14px] font-semibold text-white transition-colors hover:bg-[#333]"
                  >
                    Explore Products
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </FadeInView>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="bg-surface py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInView>
              <span className="text-caption text-text-tertiary">
                Customer Stories
              </span>
              <h2 className="text-display-md font-heading text-text-primary mt-3">
                What Our Customers Say
              </h2>
            </FadeInView>

            <StaggerList className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <StaggerItem key={i}>
                  <div className="flex h-full flex-col rounded-[20px] border border-border-default bg-white p-8">
                    <blockquote className="flex-1 text-body-md leading-relaxed text-text-secondary">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 border-t border-border-default pt-6">
                      <p className="font-heading text-body-sm font-semibold text-text-primary">
                        {testimonial.name}
                      </p>
                      <p className="mt-0.5 text-body-sm text-text-tertiary">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

        {/* ─── CONTACT / CTA ─── */}
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <FadeInView>
              <span className="text-caption text-text-tertiary">
                Get in Touch
              </span>
              <h2 className="text-display-md font-heading text-text-primary mt-3">
                Need Household
                <br />
                Essentials?
              </h2>
              <p className="mx-auto mt-6 max-w-md text-body-lg text-text-secondary">
                Message us on WhatsApp for instant pricing, bulk orders, and
                product availability. We reply within minutes.
              </p>
              <div className="mt-10 flex justify-center">
                <WhatsAppCTA className="px-10 py-4 text-base" />
              </div>

              <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
                <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <MapPin className="size-4 text-text-tertiary" />
                  India · Pan-India Delivery
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <Mail className="size-4 text-text-tertiary" />
                  hello@stutitraders.com
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <Phone className="size-4 text-text-tertiary" />
                  +91 98765 43210
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
