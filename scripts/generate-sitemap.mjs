/**
 * Generates public/sitemap.xml (and public/robots.txt) from the catalog data.
 * Run with: npm run sitemap  (also runs automatically before `npm run build`).
 *
 * IMPORTANT: the canonical domain must match src/utils/siteConfig.ts.
 * Override with the VITE_SITE_URL environment variable in `.env`.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');
const outDir = path.join(root, 'public');

const BASE_URL = (process.env.VITE_SITE_URL || 'https://lucanatackle.com').replace(/\/+$/, '');
const LAST_MOD = new Date().toISOString().slice(0, 10);

// Product category files (each is a JSON array of products)
const CATEGORY_FILES = ['reels', 'rods', 'lines', 'hooks', 'lures', 'bags'];

const products = CATEGORY_FILES.flatMap(file => {
  try {
    return JSON.parse(readFileSync(path.join(dataDir, `${file}.json`), 'utf8'));
  } catch {
    console.warn(`[sitemap] Could not read ${file}.json, skipping.`);
    return [];
  }
}).filter(p => p && p.slug && p.status === 'active');

let brands = [];
try {
  brands = JSON.parse(readFileSync(path.join(dataDir, 'brands.json'), 'utf8')).filter(b => b && b.id);
} catch {
  console.warn('[sitemap] Could not read brands.json, skipping brand URLs.');
}

const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE_URL}/shop`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/about`, priority: '0.6', changefreq: 'monthly' },
  ...CATEGORY_FILES.map(slug => ({
    loc: `${BASE_URL}/category/${slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  })),
  ...brands.map(b => ({
    loc: `${BASE_URL}/brand/${b.id}`,
    priority: '0.6',
    changefreq: 'monthly',
  })),
  ...products.map(p => ({
    loc: `${BASE_URL}/product/${p.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `# Lucana robots.txt
# Generated from scripts/generate-sitemap.mjs — keep the domain in sync with
# src/utils/siteConfig.ts.

User-agent: *
Allow: /

# Transactional funnel — excluded from search results via noindex.
Disallow: /checkout

Sitemap: ${BASE_URL}/sitemap.xml
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
writeFileSync(path.join(outDir, 'robots.txt'), robots, 'utf8');
console.log(`[sitemap] Generated sitemap.xml with ${urls.length} URLs (${products.length} products, ${brands.length} brands).`);
console.log(`[sitemap] Generated robots.txt for ${BASE_URL}.`);
