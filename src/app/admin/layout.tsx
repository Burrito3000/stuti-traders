"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { CommandPalette } from "@/components/admin/command-palette";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    const isLoggedIn = sessionStorage.getItem("stuti_admin_logged_in") === "true";
    if (!isLoggedIn) {
      setAuthorized(false);
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== "/admin/login") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
          <div className="text-xs font-semibold text-[#666666] tracking-wider uppercase">
            Verifying Admin Session...
          </div>
        </div>
      </div>
    );
  }

  // Auth pages render directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      <AdminSidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
