// Atlas Commerce — TypeScript Types

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: number;
  categoryId: string | null;
  category?: Category | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  specifications: Record<string, string> | null;
  seoTitle: string | null;
  seoDescription: string | null;
  images: ProductImage[];
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
  _count?: { orders: number };
  totalRevenue?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  status: "INQUIRY" | "QUOTATION_SENT" | "CONFIRMED" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  total: number;
  notes: string | null;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: string | null;
  toStatus: string;
  notes: string | null;
  changedBy?: { name: string };
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  revenueThisMonth: number;
  recentOrders: Order[];
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId: string | null;
  user?: { name: string };
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// Pagination
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
