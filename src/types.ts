export interface Specification {
  title: string;
  value: string;
}

export interface LineCapacity {
  nylon: string[];
  braid: string[];
}

export interface ProductColorVariant {
  name: string;
  swatch: string;
  images: string[];
  sku?: string;
  stock?: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  sub_category: string;
  description: string;
  price: number;
  discount_price: number;
  stock: number;
  sku: string;
  images: string[];
  color_variants?: ProductColorVariant[];
  specifications: Specification[];
  features: string[];
  line_capacity: LineCapacity;
  tags: string[];
  status: "active" | "inactive";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpecs?: Record<string, string>;
  selectedColor?: string;
}

export interface OrderDetails {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  deliveryNotes?: string;
}
