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

  if (filters.search) {
    filtered = searchProducts(filters.search, filtered);
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category && p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters.sub_category) {
    filtered = filtered.filter(p => p.sub_category && p.sub_category.toLowerCase() === filters.sub_category!.toLowerCase());
  }

  if (filters.brand && filters.brand !== 'all') {
    filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(p => {
      const activePrice = p.discount_price || p.price || 0;
      return activePrice >= min && activePrice <= max;
    });
  }

  if (filters.tag) {
    filtered = filtered.filter(p => p.tags && p.tags.map(t => t.toLowerCase()).includes(filters.tag!.toLowerCase()));
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
      return sorted.sort((a, b) => {
        const pA = a.discount_price || a.price || 0;
        const pB = b.discount_price || b.price || 0;
        return pA - pB;
      });
    case 'price-desc':
      return sorted.sort((a, b) => {
        const pA = a.discount_price || a.price || 0;
        const pB = b.discount_price || b.price || 0;
        return pB - pA;
      });
    case 'name-asc':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'discount':
      return sorted.sort((a, b) => {
        const pA = a.price || 0;
        const dpA = a.discount_price || a.price || 0;
        const pB = b.price || 0;
        const dpB = b.discount_price || b.price || 0;
        const discA = pA - dpA;
        const discB = pB - dpB;
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
  const prices = items.map(p => p.discount_price || p.price || 0);
  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));
  return [min, max];
}
