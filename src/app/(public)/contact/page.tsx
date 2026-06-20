"use client";

import { useState } from "react";
import { FadeInView } from "@/components/motion/animations";
import { Phone, Mail, MapPin, MessageSquare, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    subject: "Wholesale Catalogue Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        subject: "Wholesale Catalogue Inquiry",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 md:mb-20">
          <FadeInView>
            <span className="text-caption text-text-tertiary">Get in Touch</span>
            <h1 className="text-display-lg font-heading text-text-primary mt-4">
              Wholesale Inquiry & Sourcing Desk
            </h1>
            <p className="mt-6 text-body-lg text-text-secondary leading-relaxed">
              Have questions about minimum order quantities (MOQ), custom shipping routes, or want to discuss pricing brackets? Send us a message or contact us directly.
            </p>
          </FadeInView>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Contact Details (Left) */}
          <div className="lg:col-span-5 space-y-8">
            <FadeInView direction="left">
              <h2 className="text-heading-lg font-heading text-text-primary mb-6">
                Direct Contact Channels
              </h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#111111]/5 text-text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-semibold text-text-primary uppercase tracking-wider">Call Us</h3>
                    <p className="mt-1 text-body-md text-text-secondary">+977 9851063423</p>
                    <p className="text-xs text-text-tertiary">Sunday to Friday, 9:00 AM – 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#111111]/5 text-text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-semibold text-text-primary uppercase tracking-wider">Email Sourcing</h3>
                    <p className="mt-1 text-body-md text-text-secondary">hello@stutitraders.com</p>
                    <p className="text-xs text-text-tertiary">Response within 24 business hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#111111]/5 text-text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-semibold text-text-primary uppercase tracking-wider">Main Warehouse</h3>
                    <p className="mt-1 text-body-md text-text-secondary">
                      Ward No. 13, Kalimati
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      (Near Kalimati Fruits & Vegetables Market)
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>

              {/* Wholesale policy alert */}
              <div className="mt-8 rounded-[16px] border border-border-default bg-surface p-5 space-y-3">
                <div className="flex items-center gap-2 text-text-primary">
                  <HelpCircle className="h-5 w-5 shrink-0" />
                  <span className="font-heading text-sm font-semibold">Wholesale Sourcing Policy</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  We supply strictly in bulk cartons and pre-packaged wholesale bundles. We do not sell loose units or single products to individuals. Sample purchases can be requested by registered business entities.
                </p>
              </div>
            </FadeInView>
          </div>

          {/* Sourcing Form (Right) */}
          <div className="lg:col-span-7 bg-surface rounded-[24px] border border-border-default p-8 shadow-sm">
            <FadeInView direction="right">
              <h2 className="text-heading-lg font-heading text-text-primary mb-6">
                Wholesale Inquiry Form
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-500 mb-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-heading-md font-heading text-text-primary">Inquiry Sent Successfully</h3>
                  <p className="mt-2 text-body-sm text-text-secondary max-w-sm">
                    Thank you for contacting Stuti Traders. Our wholesale manager will review your business details and get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Contact Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Shyam Prasad"
                        className="flex h-11 w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Business Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                        Store/Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={form.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Shyam Retail & Distributors"
                        className="flex h-11 w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                        Business Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. contact@business.com"
                        className="flex h-11 w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. +977 98XXXXXXXX"
                        className="flex h-11 w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Inquiry Subject *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                    >
                      <option value="Wholesale Catalogue Inquiry">Request Full Catalog & Price Sheet</option>
                      <option value="Custom Sourcing Request">Custom Product Sourcing Request</option>
                      <option value="Bulk Order Quotation">Request Custom Quote for Specific Volumes</option>
                      <option value="Partnership / Distribution">Distribution Partnership Sourcing</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Requirements Details *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Please list the categories or items you are interested in, approximate monthly requirements, and delivery destination..."
                      className="flex w-full rounded-[12px] border border-[#EAEAEA] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#999999] focus:border-[#111111] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-[12px] bg-[#111111] text-white hover:bg-[#333] font-heading font-semibold text-sm transition-all"
                  >
                    {loading ? "Sending Sourcing Request..." : "Submit Wholesale Enquiry"}
                  </Button>
                </form>
              )}
            </FadeInView>
          </div>

        </div>

      </div>
    </div>
  );
}
