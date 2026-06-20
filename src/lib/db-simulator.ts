import { Product, Category, Customer, Order, OrderItem, OrderStatusHistory } from "@/types";
import { mockProducts, mockCategories, mockCustomers, mockOrders } from "./mock-data";

// Keys for local storage
const PRODUCTS_KEY = "stuti_products";
const CATEGORIES_KEY = "stuti_categories";
const CUSTOMERS_KEY = "stuti_customers";
const ORDERS_KEY = "stuti_orders";

// Helper to check if running in browser
const isClient = typeof window !== "undefined";

// Safe localStorage getters/setters
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isClient) return defaultValue;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error parsing localStorage key ${key}`, e);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Initialize database with mock data if not already set
export const initDb = () => {
  getStorageItem<Product[]>(PRODUCTS_KEY, mockProducts);
  getStorageItem<Category[]>(CATEGORIES_KEY, mockCategories);
  getStorageItem<Customer[]>(CUSTOMERS_KEY, mockCustomers);
  getStorageItem<Order[]>(ORDERS_KEY, mockOrders);
};

// Database CRUD Operations

// --- Products ---
export const dbGetProducts = (): Product[] => {
  return getStorageItem<Product[]>(PRODUCTS_KEY, mockProducts);
};

export const dbSaveProduct = (product: Product): void => {
  const products = dbGetProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index > -1) {
    products[index] = product;
  } else {
    products.push(product);
  }
  setStorageItem(PRODUCTS_KEY, products);
};

export const dbDeleteProduct = (id: string): void => {
  const products = dbGetProducts();
  const filtered = products.filter((p) => p.id !== id);
  setStorageItem(PRODUCTS_KEY, filtered);
};

// --- Categories ---
export const dbGetCategories = (): Category[] => {
  return getStorageItem<Category[]>(CATEGORIES_KEY, mockCategories);
};

export const dbSaveCategory = (category: Category): void => {
  const categories = dbGetCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index > -1) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  setStorageItem(CATEGORIES_KEY, categories);
};

export const dbDeleteCategory = (id: string): void => {
  const categories = dbGetCategories();
  const filtered = categories.filter((c) => c.id !== id);
  setStorageItem(CATEGORIES_KEY, filtered);
};

// --- Customers ---
export const dbGetCustomers = (): Customer[] => {
  const customers = getStorageItem<Customer[]>(CUSTOMERS_KEY, mockCustomers);
  const orders = dbGetOrders();

  // Dynamically calculate order count and total revenue for admin lists
  return customers.map((customer) => {
    const customerOrders = orders.filter((o) => o.customerId === customer.id);
    const totalRevenue = customerOrders
      .filter((o) => o.status !== "CANCELLED" && o.status !== "INQUIRY")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ...customer,
      _count: { orders: customerOrders.length },
      totalRevenue,
    };
  });
};

export const dbSaveCustomer = (customer: Customer): void => {
  const customers = getStorageItem<Customer[]>(CUSTOMERS_KEY, mockCustomers);
  const index = customers.findIndex((c) => c.id === customer.id);
  if (index > -1) {
    customers[index] = { ...customers[index], ...customer, updatedAt: new Date().toISOString() };
  } else {
    customers.push(customer);
  }
  setStorageItem(CUSTOMERS_KEY, customers);
};

// --- Orders ---
export const dbGetOrders = (): Order[] => {
  const orders = getStorageItem<Order[]>(ORDERS_KEY, mockOrders);
  const customers = getStorageItem<Customer[]>(CUSTOMERS_KEY, mockCustomers);

  // Attach customer details dynamically
  return orders.map((order) => {
    const customer = customers.find((c) => c.id === order.customerId);
    return {
      ...order,
      customer,
    };
  });
};

export const dbSaveOrder = (order: Order): void => {
  const orders = getStorageItem<Order[]>(ORDERS_KEY, mockOrders);
  const index = orders.findIndex((o) => o.id === order.id);
  if (index > -1) {
    orders[index] = { ...orders[index], ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.push(order);
  }
  setStorageItem(ORDERS_KEY, orders);
};

// Submit a new order inquiry from checkout details form
export const dbAddOrderInquiry = (
  customerDetails: {
    name: string;
    businessName: string;
    phone: string;
    address: string;
    notes?: string;
  },
  cartItems: {
    product: Product;
    quantity: number;
    unit: "pcs" | "dz";
  }[]
): Order => {
  const customers = getStorageItem<Customer[]>(CUSTOMERS_KEY, mockCustomers);
  const orders = getStorageItem<Order[]>(ORDERS_KEY, mockOrders);

  const cleanPhone = customerDetails.phone.replace(/[^0-9+]/g, "");

  // 1. Find or create Customer
  let customer = customers.find(
    (c) => c.phone?.replace(/[^0-9+]/g, "") === cleanPhone
  );

  if (!customer) {
    customer = {
      id: `cust-${Date.now()}`,
      name: customerDetails.name,
      phone: customerDetails.phone,
      whatsapp: customerDetails.phone,
      email: `${customerDetails.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      address: customerDetails.address,
      notes: `Store/Business Name: ${customerDetails.businessName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customers.push(customer);
    setStorageItem(CUSTOMERS_KEY, customers);
  } else {
    // Update existing customer note with latest business name just in case
    customer.notes = `Store/Business Name: ${customerDetails.businessName}`;
    customer.updatedAt = new Date().toISOString();
    setStorageItem(CUSTOMERS_KEY, customers);
  }

  // 2. Calculate totals for admin tracking (in pieces: multiply dozens by 12 for price calculation)
  const orderItems: OrderItem[] = cartItems.map((item, idx) => {
    const multiplier = item.unit === "dz" ? 12 : 1;
    const unitPrice = item.product.price;
    const totalPrice = unitPrice * item.quantity * multiplier;

    return {
      id: `item-${Date.now()}-${idx}`,
      orderId: `order-${Date.now()}`,
      productId: item.product.id,
      product: item.product,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
      notes: `Unit: ${item.unit}`,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal; // no tax/discount calculated for inquiry phase

  // 3. Generate Order Number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ST-${new Date().getFullYear()}-${randomNum}`;

  // 4. Initial Timeline History
  const statusHistory: OrderStatusHistory[] = [
    {
      id: `hist-${Date.now()}`,
      orderId: `order-${Date.now()}`,
      fromStatus: null,
      toStatus: "INQUIRY",
      notes: `Wholesale inquiry submitted via website. Notes: ${customerDetails.notes || "None"}`,
      createdAt: new Date().toISOString(),
      changedBy: { name: customerDetails.name },
    },
  ];

  // 5. Create Order
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    orderNumber,
    customerId: customer.id,
    status: "INQUIRY",
    subtotal,
    total,
    notes: customerDetails.notes || null,
    items: orderItems,
    statusHistory,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  setStorageItem(ORDERS_KEY, orders);

  return {
    ...newOrder,
    customer,
  };
};

// Get Dashboard Statistics dynamically
export const dbGetDashboardStats = (): {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    monthlyRevenue: number;
    revenueTrend: string;
    ordersTrend: string;
    customersTrend: string;
    productsTrend: string;
  };
  recentOrders: Order[];
  recentActivity: any[];
} => {
  initDb();
  const products = dbGetProducts();
  const customers = dbGetCustomers();
  const orders = dbGetOrders();

  const activeOrders = orders.filter((o) => o.status !== "CANCELLED");
  
  // Total Revenue of confirmed/processing/delivered orders
  const confirmedRevenue = orders
    .filter((o) => ["CONFIRMED", "PROCESSING", "DELIVERED"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const stats = {
    totalProducts: products.length,
    totalCustomers: customers.length,
    totalOrders: orders.length,
    monthlyRevenue: confirmedRevenue,
    revenueTrend: "+18.4% from last month",
    ordersTrend: `+${orders.filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth()).length} new this month`,
    customersTrend: `+${customers.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length} new this month`,
    productsTrend: "Catalog active",
  };

  // Sort orders by date descending
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Generate activities dynamically from status histories
  const activities: any[] = [];
  orders.forEach((o) => {
    o.statusHistory?.forEach((h) => {
      activities.push({
        id: h.id,
        action: h.toStatus === "INQUIRY" ? "INQUIRY_CREATED" : "ORDER_STATUS_UPDATED",
        entityType: "Order",
        entityId: o.id,
        user: { name: h.changedBy?.name || "System" },
        metadata: {
          orderNumber: o.orderNumber,
          status: h.toStatus,
          notes: h.notes,
        },
        createdAt: h.createdAt,
      });
    });
  });

  // Sort activities by date descending
  const sortedActivities = activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    stats,
    recentOrders: sortedOrders.slice(0, 5),
    recentActivity: sortedActivities.slice(0, 6),
  };
};
