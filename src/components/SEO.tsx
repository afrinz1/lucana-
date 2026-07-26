import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  type?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  type = 'website',
  ogImage
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('Lucana') ? title : `${title} | Lucana`;
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

    // 6. Set OG URL
    const canonicalUrl = `https://lucanatackle.com${pathname}`;
    setMetaTag('property', 'og:url', canonicalUrl);
    setCanonicalLink(canonicalUrl);

    // 7. Set Images
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
      setMetaTag('name', 'twitter:image', ogImage);
    }
  }, [title, description, keywords, type, ogImage, pathname]);

  return null; // This component works entirely via side-effects
};
