"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-[28px] font-bold tracking-tight text-[#111111]">
            Stuti Traders
          </h1>
          <p className="mt-2 text-body-sm text-[#666666]">
            Sign in to manage your store
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Auth wiring will go here
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[13px] font-medium text-[#111111]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-[12px] border-[#EAEAEA] bg-[#FAFAFA] text-sm placeholder:text-[#999999] focus-visible:ring-[#111111]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[13px] font-medium text-[#111111]"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-[12px] border-[#EAEAEA] bg-[#FAFAFA] pr-10 text-sm placeholder:text-[#999999] focus-visible:ring-[#111111]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-[14px] bg-[#111111] text-sm font-semibold text-white hover:bg-[#333]"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#999999]">
          Stuti Traders — Household Essentials Management
        </p>
      </div>
    </div>
  );
}
