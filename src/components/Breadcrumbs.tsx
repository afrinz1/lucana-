import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SITE_URL } from '../utils/siteConfig';

export interface Crumb {
  name: string;
  /** Internal route (e.g. "/shop"). Omit for the current (non-linked) page. */
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  /** Light variant for use on dark imagery (e.g. category hero banners). */
  light?: boolean;
  className?: string;
}

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD.
 * The last item is the current page (rendered as plain text, not a link).
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, light = false, className = '' }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.to ? { item: `${SITE_URL}${item.to}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap text-[10px] sm:text-xs font-bold uppercase tracking-wider space-x-1.5 ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.name}-${index}`}>
            {item.to ? (
              <Link
                to={item.to}
                className={
                  light
                    ? 'text-gray-300 hover:text-white transition-colors'
                    : 'text-gray-400 hover:text-gray-900 transition-colors'
                }
              >
                {item.name}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={light ? 'text-white font-extrabold' : 'text-gray-950 font-extrabold line-clamp-1'}
              >
                {item.name}
              </span>
            )}
            {!isLast && (
              <ChevronRight
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${light ? 'text-gray-500' : 'text-gray-300'}`}
              />
            )}
          </React.Fragment>
        );
      })}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </nav>
  );
};
