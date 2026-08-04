import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../utils/siteConfig';

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

    // Helper to remove a meta tag (prevents stale values leaking between pages)
    const removeMetaTag = (attrName: string, attrVal: string) => {
      document.querySelectorAll(`meta[${attrName}="${attrVal}"]`).forEach(el => el.remove());
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

    // 4. Keywords: always sync — remove stale ones from the previous page
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    } else {
      removeMetaTag('name', 'keywords');
    }

    // 5. Set Content Type
    setMetaTag('property', 'og:type', type);

    // 6. Set OG URL + canonical (pathname only — query params stay uncanonicalized)
    const canonicalUrl = `${SITE_URL}${pathname}`;
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setCanonicalLink(canonicalUrl);

    // 7. Images: always sync — remove stale OG/Twitter images when none provided
    const image = ogImage || DEFAULT_OG_IMAGE;
    setMetaTag('property', 'og:image', image);
    setMetaTag('name', 'twitter:image', image);

    // 8. Site-level Open Graph & Twitter metadata
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // 9. Crawler directives (noindex for 404, checkout, thank-you, etc.)
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
