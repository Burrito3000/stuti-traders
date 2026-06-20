"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("stuti_admin_logged_in") === "true";
    if (isLoggedIn) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Hardcoded login check for prototype demo
      if (email === "admin@stutitraders.com" && password === "admin123") {
        sessionStorage.setItem("stuti_admin_logged_in", "true");
        toast.success("Welcome back, Admin!");
        router.replace("/admin");
      } else {
        toast.error("Invalid email or password");
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-[28px] font-bold tracking-tight text-[#111111]">
            Stuti Traders
          </h1>
          <p className="mt-2 text-body-sm text-[#666666]">
            Sign in to manage your wholesale store
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[20px] border border-[#EAEAEA] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-[#111111]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@stutitraders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-[12px] border-[#EAEAEA] bg-[#FAFAFA] text-sm placeholder:text-[#999999] focus-visible:ring-[#111111]"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-medium text-[#111111]">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="admin123"
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
              disabled={loading}
              className="h-11 w-full rounded-[14px] bg-[#111111] text-sm font-semibold text-white hover:bg-[#333] transition-colors"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Credentials Helper Alert */}
          <div className="mt-6 flex gap-2.5 rounded-[12px] border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-blue-800">
            <Lock className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
            <div>
              <p className="font-semibold">Demo Credentials</p>
              <p className="mt-1 text-[#666666] leading-relaxed">
                Email: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">admin@stutitraders.com</code>
                <br />
                Password: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">admin123</code>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#999999]">
          Stuti Traders — Household Essentials Management
        </p>
      </div>
    </div>
  );
}
