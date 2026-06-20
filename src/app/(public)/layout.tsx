import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CartDrawer } from "@/components/public/cart-drawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
