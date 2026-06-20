"use client";

import * as React from "react";
import { AdminHeader } from "@/components/admin/header";
import { Save, Building, ShieldCheck, CreditCard, Bell, ToggleLeft, ToggleRight, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const [form, setForm] = React.useState({
    storeName: "Stuti Traders",
    description: "Your trusted destination for premium household essentials — kitchenware, storage, cleaning, and home care products.",
    whatsappNumber: "+977 9851063423",
    email: "hello@stutitraders.com",
    address: "Ward No. 13, Kalimati, Kathmandu, Nepal",
    minOrderUnits: 12,
    enableCatalogue: true,
    requireApproval: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: "enableCatalogue" | "requireApproval") => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <>
      <AdminHeader
        title="Settings"
        actions={
          <Button
            onClick={handleSave}
            className="h-9 gap-2 rounded-[14px] bg-[#111111] px-4 text-sm font-medium text-white hover:bg-[#333333]"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
        <div className="mx-auto max-w-4xl p-6 lg:p-8 space-y-8">
          
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Section: General Store Profile */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-4 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#111111]/5 text-[#111111]">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#111111]">General Profile</h2>
                  <p className="text-xs text-[#999999]">Manage your public showroom profile and details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Store Name
                    </label>
                    <Input
                      name="storeName"
                      value={form.storeName}
                      onChange={handleChange}
                      className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Store Bio / Description
                  </label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section: Wholesale & Sourcing Channels */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-4 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#111111]/5 text-[#111111]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#111111]">Contact & Sourcing Channels</h2>
                  <p className="text-xs text-[#999999]">Configure numbers and addresses for WhatsApp sourcing.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Wholesale WhatsApp Number
                    </label>
                    <Input
                      name="whatsappNumber"
                      value={form.whatsappNumber}
                      onChange={handleChange}
                      className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                      Contact Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                    />
                  </div>
                </div>

                {/* Warehouse address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Warehouse/Office Address
                  </label>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                  />
                </div>
              </div>
            </div>

            {/* Section: Wholesale Ordering Policies */}
            <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-4 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#111111]/5 text-[#111111]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#111111]">Catalogue & Sourcing Rules</h2>
                  <p className="text-xs text-[#999999]">Control catalogue visibility and wholesale constraints.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Min Order Units */}
                <div className="max-w-xs space-y-1.5">
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Minimum Order Quantity (Units)
                  </label>
                  <Input
                    name="minOrderUnits"
                    type="number"
                    value={form.minOrderUnits}
                    onChange={handleChange}
                    className="h-10 rounded-[12px] border-[#EAEAEA] text-sm focus-visible:ring-[#111111]"
                  />
                  <p className="text-[11px] text-[#999999]">Warn customers if their checkout cart has fewer units.</p>
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-2">
                  {/* Enable Catalogue */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#111111]">Enable Public Catalogue</h3>
                      <p className="text-xs text-[#999999] mt-0.5">Toggle to take your catalog showroom online or offline.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("enableCatalogue")}
                      className="text-[#111111] hover:scale-105 transition-all"
                    >
                      {form.enableCatalogue ? (
                        <ToggleRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-[#CCCCCC]" />
                      )}
                    </button>
                  </div>

                  {/* Require Sourcing Details */}
                  <div className="flex items-center justify-between border-t border-[#F5F5F5] pt-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#111111]">Enforce Details on WhatsApp Checkout</h3>
                      <p className="text-xs text-[#999999] mt-0.5">Require customer to fill contact and business details before redirecting.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("requireApproval")}
                      className="text-[#111111] hover:scale-105 transition-all"
                    >
                      {form.requireApproval ? (
                        <ToggleRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-[#CCCCCC]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </form>

        </div>
      </div>
    </>
  );
}
