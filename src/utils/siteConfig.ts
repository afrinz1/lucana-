/**
 * Central site / SEO configuration.
 *
 * Everything that references the site URL (canonical tags, Open Graph,
 * JSON-LD schema, sitemap, robots.txt) MUST read from here so the whole
 * site points at one canonical domain. Override via VITE_SITE_URL in `.env`.
 */

export const SITE_NAME = 'Lucana';

/** Canonical production domain (no trailing slash). */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://lucanatackle.com'
).replace(/\/+$/, '');

/** Default social share image (used when a page has no specific image). */
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200';

/** Brand social profiles (also used in Organization `sameAs` schema). */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/lucanatackle',
  instagram: 'https://www.instagram.com/lucanatackle',
  twitter: 'https://twitter.com/lucanatackle',
  youtube: 'https://www.youtube.com/@lucanatackle',
} as const;

/** Contact details used in Organization schema. */
export const CONTACT = {
  telephone: '+1-800-LUCANA-9',
  email: 'support@lucanatackle.com',
  address: {
    streetAddress: '700 Water St',
    addressLocality: 'Seattle',
    addressRegion: 'WA',
    postalCode: '98104',
    addressCountry: 'US',
  },
};
