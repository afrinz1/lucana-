/**
 * Generates public/sitemap.xml from the product catalog data.
 * Run with: npm run sitemap  (also runs automatically before `npm run build`).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');
const outDir = path.join(root, 'public');

const BASE_URL = 'https://lucana-three.vercel.app';
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

const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE_URL}/shop`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/about`, priority: '0.6', changefreq: 'monthly' },
  ...CATEGORY_FILES.map(slug => ({
    loc: `${BASE_URL}/category/${slug}`,
    priority: '0.8',
    changefreq: 'weekly',
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

mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] Generated sitemap.xml with ${urls.length} URLs (${products.length} products).`);
