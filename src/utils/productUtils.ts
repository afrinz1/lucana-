import { Product, Category, Brand } from '../types';
import reelsData from '../data/reels.json';
import rodsData from '../data/rods.json';
import linesData from '../data/lines.json';
import hooksData from '../data/hooks.json';
import luresData from '../data/lures.json';
import bagsData from '../data/bags.json';
import categoriesData from '../data/categories.json';
import brandsData from '../data/brands.json';
import featuredData from '../data/featured.json';

// Combine individual product categories into a single data array
const productsData = [
  ...reelsData,
  ...rodsData,
  ...linesData,
  ...hooksData,
  ...luresData,
  ...bagsData
];

// Typecast the imported JSON to make sure TypeScript handles them nicely
export const products: Product[] = productsData as Product[];
export const categories: Category[] = categoriesData as Category[];
export const brands: Brand[] = brandsData as Brand[];
export const featured = featuredData as {
  hero: Array<{ title: string; subtitle: string; image: string; slug: string; tag: string }>;
  best_sellers: string[];
  new_arrivals: string[];
  featured: string[];
};

// ---------------------------------------------------------------------------
// Product derived values (shared by ProductCard, ProductDetailPage, cart, etc.)
// ---------------------------------------------------------------------------

/** Fallback image used whenever a product has no images. */
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800';

/** The list price before any discount. */
export function getBasePrice(product: Pick<Product, 'price'>): number {
  return typeof product.price === 'number' ? product.price : 0;
}

/** The discounted price when one exists, otherwise the base price. */
export function getActivePrice(product: Pick<Product, 'price' | 'discount_price'>): number {
  const discount = typeof product.discount_price === 'number' ? product.discount_price : 0;
  return discount || getBasePrice(product);
}

/** True when the product currently has an active discount. */
export function hasDiscount(product: Pick<Product, 'price' | 'discount_price'>): boolean {
  const discount = typeof product.discount_price === 'number' ? product.discount_price : 0;
  return discount > 0 && discount < getBasePrice(product);
}

/** Total amount a buyer saves when a discount is active. */
export function getSavings(product: Pick<Product, 'price' | 'discount_price'>): number {
  return hasDiscount(product) ? getBasePrice(product) - (product.discount_price || 0) : 0;
}

/** True when the product has no stock left. */
export function isOutOfStock(product: Pick<Product, 'stock'>): boolean {
  return typeof product.stock === 'number' ? product.stock <= 0 : false;
}

/** The first product image, or the default fallback. */
export function getMainImage(product: Pick<Product, 'images'>): string {
  return (product.images && product.images.length > 0 && product.images[0]) || DEFAULT_PRODUCT_IMAGE;
}

/** Deterministic simulated rating derived from the product id. */
export function getSimulatedRating(product: Pick<Product, 'id'>): string {
  return (4.5 + (product.id % 6) * 0.1).toFixed(1);
}

/** Deterministic simulated review count derived from the product id. */
export function getReviewsCount(product: Pick<Product, 'id'>): number {
  return 12 + (product.id * 7) % 43;
}

/** Format a number as a USD price string, e.g. 12.5 -> "$12.50". */
export function formatPrice(value: number): string {
  return `$${(value || 0).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Shipping rules
// ---------------------------------------------------------------------------

export const FREE_SHIPPING_THRESHOLD = 150;
export const FLAT_SHIPPING_FEE = 12.5;

/** Flat shipping cost for a subtotal (free express above the threshold). */
export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

/** Human-readable shipping line, e.g. "FREE EXPRESS" or "$12.50". */
export function getShippingLabel(subtotal: number): string {
  const cost = getShippingCost(subtotal);
  return cost === 0 ? 'FREE EXPRESS' : formatPrice(cost);
}

// ---------------------------------------------------------------------------
// Product lookups & collections
// ---------------------------------------------------------------------------

/**
 * Retrieve a product by its unique slug.
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug && p.status === 'active');
}

/**
 * Get products by category slug.
 */
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => (p.category || '').toLowerCase() === categorySlug.toLowerCase() && p.status === 'active');
}

/**
 * Get featured products collections based on featured.json lists.
 */
export function getFeaturedProducts(collectionType: 'best_sellers' | 'new_arrivals' | 'featured'): Product[] {
  const slugs = featured[collectionType] || [];
  return products.filter(p => slugs.includes(p.slug) && p.status === 'active');
}

/**
 * Get related products based on category, brand, and tags (excluding the current product itself).
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.id !== product.id && p.status === 'active')
    .map(p => {
      let score = 0;
      if (p.category === product.category) score += 5;
      if (p.sub_category === product.sub_category) score += 3;
      if (p.brand === product.brand) score += 2;

      // Calculate intersection of tags
      const commonTags = p.tags.filter(t => product.tags.includes(t));
      score += commonTags.length * 1.5;

      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}

/**
 * Search products by name, brand, category, subcategory, or tags.
 */
export function searchProducts(query: string, items: Product[] = products): Product[] {
  if (!query) return items;
  const cleanQuery = query.toLowerCase().trim();

  return items.filter(p => {
    return (
      (p.name || '').toLowerCase().includes(cleanQuery) ||
      (p.brand || '').toLowerCase().includes(cleanQuery) ||
      (p.category || '').toLowerCase().includes(cleanQuery) ||
      (p.sub_category || '').toLowerCase().includes(cleanQuery) ||
      (p.tags || []).some(tag => tag && tag.toLowerCase().includes(cleanQuery))
    );
  });
}

/**
 * Filter products list by various parameters.
 */
export function filterProducts(
  items: Product[],
  filters: {
    category?: string;
    brand?: string;
    sub_category?: string;
    priceRange?: [number, number];
    search?: string;
    tag?: string;
  }
): Product[] {
  let filtered = [...items];
  const { category, brand, sub_category, priceRange, search, tag } = filters;

  if (search) {
    filtered = searchProducts(search, filtered);
  }

  if (category && category !== 'all') {
    const cat = category.toLowerCase();
    filtered = filtered.filter(p => p.category && p.category.toLowerCase() === cat);
  }

  if (sub_category) {
    const sub = sub_category.toLowerCase();
    filtered = filtered.filter(p => p.sub_category && p.sub_category.toLowerCase() === sub);
  }

  if (brand && brand !== 'all') {
    const br = brand.toLowerCase();
    filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === br);
  }

  if (priceRange) {
    const [min, max] = priceRange;
    filtered = filtered.filter(p => {
      const activePrice = getActivePrice(p);
      return activePrice >= min && activePrice <= max;
    });
  }

  if (tag) {
    const t = tag.toLowerCase();
    filtered = filtered.filter(p => p.tags && p.tags.map(x => x.toLowerCase()).includes(t));
  }

  return filtered;
}

/**
 * Sort products based on rules.
 */
export function sortProducts(items: Product[], sortBy: string): Product[] {
  const sorted = [...items];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => getActivePrice(a) - getActivePrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => getActivePrice(b) - getActivePrice(a));
    case 'name-asc':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'discount':
      return sorted.sort((a, b) => {
        const discA = getBasePrice(a) - getActivePrice(a);
        const discB = getBasePrice(b) - getActivePrice(b);
        return discB - discA;
      });
    case 'featured':
    default:
      // Return default ordering or order by ID
      return sorted.sort((a, b) => a.id - b.id);
  }
}

/**
 * Returns the price range limits (min and max) from a list of products.
 */
export function getPriceBounds(items: Product[]): [number, number] {
  if (items.length === 0) return [0, 500];
  const prices = items.map(p => getActivePrice(p));
  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));
  return [min, max];
}
