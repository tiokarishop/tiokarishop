export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  stock: number;
  isActive: boolean;
  images: string[];
  attributes: unknown;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
  options: unknown;
  image: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export interface Review {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  stripePaymentId: string | null;
  shippingAddress: Address;
  billingAddress: Address | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
