import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerList, StaggerItem } from "@/components/motion/animations";
import { CheckCircle2, Award, ShieldCheck, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Stuti Traders",
  description: "Learn about Stuti Traders, Kathmandu's premier wholesale supplier of quality household items, kitchenware, and storage solutions.",
};

const stats = [
  { label: "Years of Trust", value: "5+" },
  { label: "Wholesale Clients", value: "500+" },
  { label: "Products Cataloged", value: "1,000+" },
  { label: "Districts Supplied", value: "45+" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Unmatched Quality",
    description: "Every item in our collection undergoes strict quality assessments to ensure it meets bulk standard durability.",
  },
  {
    icon: Award,
    title: "Direct Sourcing",
    description: "We work directly with major manufacturers to bypass middlemen, transferring maximum cost savings to you.",
  },
  {
    icon: CheckCircle2,
    title: "Reliable Inventory",
    description: "We maintain deep stock levels of all essentials to ensure that your business never runs out of popular inventory.",
  },
  {
    icon: Truck,
    title: "Swift Logistics",
    description: "From our Kathmandu warehouse, we arrange reliable freight forwarding and delivery across all major regions of Nepal.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center mb-16 md:mb-24">
          <FadeInView>
            <span className="text-caption text-text-tertiary">Our Story</span>
            <h1 className="text-display-lg font-heading text-text-primary mt-4">
              Your Trusted Wholesale Partner for Household Essentials
            </h1>
            <p className="mt-6 text-body-lg text-text-secondary leading-relaxed">
              Based in Kathmandu, Nepal, Stuti Traders has been a foundational supplier for local retail stores, department shops, and corporate partners. We bridge the gap between world-class manufacturers and local businesses.
            </p>
          </FadeInView>
        </div>

        {/* Brand Image Split Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-24 md:mb-32">
          <FadeInView direction="left" className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#F5F5F5] shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200"
              alt="Kitchen items on display"
              fill
              className="object-cover"
            />
          </FadeInView>
          
          <FadeInView direction="right" className="space-y-6">
            <h2 className="text-display-md font-heading text-text-primary">
              Empowering Retailers Across Nepal
            </h2>
            <p className="text-body-md text-text-secondary leading-relaxed">
              At Stuti Traders, we believe that small and medium retail businesses are the backbone of community commerce. That is why we do not offer retail sales directly on our platform. Instead, we customize our catalogue for wholesale buyers, ensuring you get direct-from-factory rates through volume ordering.
            </p>
            <p className="text-body-md text-text-secondary leading-relaxed">
              Whether you are looking to source high-grade stainless steel pressure cookers, airtight food storage canisters, home cleaning supplies, or elegant copper flasks, our inventory is curated to match localized demand across Nepal's urban and suburban centers.
            </p>
          </FadeInView>
        </div>

        {/* Stats Grid */}
        <div className="border-y border-border-default py-12 mb-24 md:mb-32">
          <StaggerList className="grid grid-cols-2 gap-8 lg:grid-cols-4 text-center">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="space-y-2">
                <p className="text-display-lg font-heading text-text-primary font-bold">{stat.value}</p>
                <p className="text-caption text-text-secondary uppercase tracking-wider">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>

        {/* Core Values Section */}
        <div className="space-y-12">
          <div className="mx-auto max-w-2xl text-center">
            <FadeInView>
              <h2 className="text-display-md font-heading text-text-primary">
                Why Partner With Us?
              </h2>
              <p className="mt-4 text-body-md text-text-secondary">
                We design our wholesale operations around the operational success of your business.
              </p>
            </FadeInView>
          </div>

          <StaggerList className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12 pt-6">
            {values.map((val) => (
              <StaggerItem key={val.title} className="flex gap-4 p-6 rounded-[20px] border border-border-default bg-surface shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#111111]/5 text-text-primary">
                  <val.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-heading-md font-heading text-text-primary">{val.title}</h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">{val.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>

      </div>
    </div>
  );
}
