import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  type?: string;
  ogImage?: string;
  /** Crawler directives. Use 'noindex, nofollow' for pages like 404s. */
  robots?: 'index, follow' | 'noindex, nofollow';
  /** JSON-LD structured data blocks (Product, BreadcrumbList, etc.) to inject per page. */
  structuredData?: Record<string, unknown>[];
}

const SITE_NAME = 'Lucana';
const SITE_URL = 'https://lucanatackle.com';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  type = 'website',
  ogImage,
  robots = 'index, follow',
  structuredData,
}) => {
  const { pathname } = useLocation();

  // Stable key so the effect only re-runs when the schema content actually changes
  const structuredDataKey = JSON.stringify(structuredData || []);

  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update canonical link
    const setCanonicalLink = (url: string) => {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    // 2. Set description
    const defaultDesc = 'Premium, modern e-commerce platform for high-performance fishing tackle, including reels, rods, lines, hooks, lures, and bags.';
    const finalDesc = description || defaultDesc;
    setMetaTag('name', 'description', finalDesc);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('name', 'twitter:description', finalDesc);

    // 3. Set Open Graph & Twitter titles
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('name', 'twitter:title', fullTitle);

    // 4. Set keywords if specified
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 5. Set Content Type
    setMetaTag('property', 'og:type', type);

    // 6. Set OG URL + canonical
    const canonicalUrl = `${SITE_URL}${pathname}`;
    setMetaTag('property', 'og:url', canonicalUrl);
    setCanonicalLink(canonicalUrl);

    // 7. Set Images
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
      setMetaTag('name', 'twitter:image', ogImage);
    }

    // 8. Site-level Open Graph & Twitter metadata
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // 9. Crawler directives (noindex for 404, thank-you, etc.)
    setMetaTag('name', 'robots', robots);

    // 10. JSON-LD structured data (remove any stale blocks from previous page first)
    document.querySelectorAll('script[id^="jsonld-"]').forEach(script => script.remove());
    (structuredData || []).forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `jsonld-${index}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [title, description, keywords, type, ogImage, robots, structuredDataKey, pathname]);

  return null; // This component works entirely via side-effects
};
