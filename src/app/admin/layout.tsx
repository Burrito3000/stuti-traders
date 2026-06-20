import { AdminSidebar } from "@/components/admin/sidebar";
import { CommandPalette } from "@/components/admin/command-palette";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
