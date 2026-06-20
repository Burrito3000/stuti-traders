// Stuti Traders — Application Constants

export const APP_NAME = "Stuti Traders";
export const APP_DESCRIPTION = "Your trusted destination for premium household essentials — kitchenware, storage, cleaning, and home care products.";

// WhatsApp
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210";

export const getWhatsAppUrl = (productName?: string) => {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;
  if (!productName) return baseUrl;
  const message = encodeURIComponent(
    `Hello Stuti Traders,\nI'm interested in:\n\n${productName}\n\nPlease share price and availability.`
  );
  return `${baseUrl}?text=${message}`;
};

// Product Statuses
export const PRODUCT_STATUSES = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  ACTIVE: { label: "Active", color: "bg-emerald-50 text-emerald-700" },
  ARCHIVED: { label: "Archived", color: "bg-amber-50 text-amber-700" },
} as const;

// Order Statuses
export const ORDER_STATUSES = {
  INQUIRY: { label: "Inquiry", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  QUOTATION_SENT: { label: "Quotation Sent", color: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
  CONFIRMED: { label: "Confirmed", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  PROCESSING: { label: "Processing", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  DELIVERED: { label: "Delivered", color: "bg-green-50 text-green-700", dot: "bg-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700", dot: "bg-red-500" },
} as const;

export type ProductStatus = keyof typeof PRODUCT_STATUSES;
export type OrderStatus = keyof typeof ORDER_STATUSES;

// Navigation
export const PUBLIC_NAV_ITEMS = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "Layers" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Currency — INR
export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  locale: "en-IN",
} as const;

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Date formatting
export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
