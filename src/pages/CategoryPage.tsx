import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Anchor, ArrowRight } from 'lucide-react';
import { filterProducts, getProductsByCategory, categories } from '../utils/productUtils';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEO } from '../components/SEO';
import { SITE_URL } from '../utils/siteConfig';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Find Category Metadata
  const categoryMeta = useMemo(() => {
    return categories.find(c => c.slug === categorySlug);
  }, [categorySlug]);

  // Core Category Products list
  const categoryProducts = useMemo(() => {
    return categorySlug ? getProductsByCategory(categorySlug) : [];
  }, [categorySlug]);

  // Sub-category Filter State
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Reset Sub Category when categorySlug changes
  useEffect(() => {
    setSelectedSubCategory('all');
  }, [categorySlug]);

  // Filtered List based on Sub-category selection
  const filteredProducts = useMemo(() => {
    return filterProducts(categoryProducts, {
      sub_category: selectedSubCategory === 'all' ? undefined : selectedSubCategory,
    });
  }, [categoryProducts, selectedSubCategory]);

  if (!categoryMeta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center py-20 bg-gray-50 pt-28">
        <h2 className="text-xl font-bold text-gray-900">Category Not Found</h2>
        <p className="text-sm text-gray-400 mt-1 max-w-sm">
          The requested tackle category doesn't exist. Select another collection from the navigation header.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-[#C62828] transition-colors"
        >
          BACK TO THE SHOP
        </Link>
      </div>
    );
  }

  // Defined after the categoryMeta null check so it is safe to dereference
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryMeta.name} — Lucana Tackle`, 
    numberOfItems: filteredProducts.length,
    itemListElement: filteredProducts.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/product/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div id="category-page" className="bg-[#FAF9F9] min-h-screen pt-[73px] pb-20">
      <SEO 
        title={`${categoryMeta.name} | High-Performance Fishing Tackle`}
        description={categoryMeta.description || `Browse our selection of premium ${categoryMeta.name} and tournament rigging equipment.`}
        ogImage={categoryMeta.image}
        structuredData={[itemListSchema]}
      />
      
      {/* 1. Immersive Category Header Banner */}
      <section id="category-header-banner" className="relative h-80 md:h-96 bg-gray-950 overflow-hidden flex items-center">
        {/* Banner Cover Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent z-10" />
        <img
          src={categoryMeta.image}
          alt={categoryMeta.name}
          className="absolute inset-0 w-full h-full object-cover object-center scale-102"
          referrerPolicy="no-referrer"
        />

        {/* Header content container */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl md:max-w-2xl space-y-4">
              
              {/* Breadcrumb row */}
              <Breadcrumbs
                light
                items={[
                  { name: 'Home', to: '/' },
                  { name: 'Shop', to: '/shop' },
                  { name: categoryMeta.name },
                ]}
              />

              <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight uppercase">
                {categoryMeta.name}
              </h1>
              
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium leading-relaxed">
                {categoryMeta.description}
              </p>

              {/* Tag detailing count */}
              <div className="flex items-center space-x-3 text-[11px] font-bold text-gray-400 font-mono">
                <span className="bg-white/10 px-3 py-1 rounded-full text-white">
                  {categoryProducts.length} PRODUCTS ONLINE
                </span>
                <span>&bull;</span>
                <span>{categoryMeta.subcategories.length} CUSTOM SUB-SERIES</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Main content block */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Sub-category Quick Chip Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2 hidden md:block">Sub-series:</span>
            
            {/* All chip */}
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-50 border border-gray-150 text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Series ({categoryProducts.length})
            </button>

            {/* Custom Subcategory chips */}
            {categoryMeta.subcategories.map(sub => {
              const count = categoryProducts.filter(p => (p.sub_category || '').toLowerCase() === sub.toLowerCase()).length;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    (selectedSubCategory || '').toLowerCase() === sub.toLowerCase()
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-50 border border-gray-150 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {sub} ({count})
                </button>
              );
            })}
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center space-x-1.5 uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C62828]" />
            <span>Open Advanced Filters</span>
          </Link>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 animate-pulse">
              <Anchor className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">No Tackle Registered Under This Series</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
              We're currently field-testing new tackle releases for this collection series. Click below to view the rest of our shop.
            </p>
            <Link
              to="/shop"
              className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-[#C62828] transition-colors inline-block"
            >
              Browse Shop All
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Cross-category contextual links — distribute authority + aid discovery */}
        {PAIRING_LINKS[categoryMeta.id] && PAIRING_LINKS[categoryMeta.id].length > 0 && (
          <section id="category-pairings" className="pt-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="font-sans font-bold text-gray-900 text-sm sm:text-base uppercase tracking-wider">
                Complete Your Rig
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">
                Pair your {categoryMeta.name.toLowerCase()} with complementary Lucana gear.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                {PAIRING_LINKS[categoryMeta.id].map(pair => (
                  <Link
                    key={pair.slug}
                    to={`/category/${pair.slug}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                  >
                    <span>Shop {pair.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

/** Contextual cross-category links shown on each category page. */
const PAIRING_LINKS: Record<string, { name: string; slug: string }[]> = {
  reels: [
    { name: 'Fishing Lines', slug: 'lines' },
    { name: 'Fishing Rods', slug: 'rods' },
    { name: 'Fishing Lures', slug: 'lures' },
  ],
  rods: [
    { name: 'Fishing Reels', slug: 'reels' },
    { name: 'Fishing Lines', slug: 'lines' },
    { name: 'Fishing Lures', slug: 'lures' },
  ],
  lines: [
    { name: 'Fishing Hooks', slug: 'hooks' },
    { name: 'Fishing Reels', slug: 'reels' },
    { name: 'Fishing Lures', slug: 'lures' },
  ],
  hooks: [
    { name: 'Fishing Lines', slug: 'lines' },
    { name: 'Fishing Lures', slug: 'lures' },
  ],
  lures: [
    { name: 'Fishing Rods', slug: 'rods' },
    { name: 'Fishing Hooks', slug: 'hooks' },
    { name: 'Fishing Lines', slug: 'lines' },
  ],
  bags: [
    { name: 'Fishing Reels', slug: 'reels' },
    { name: 'Fishing Rods', slug: 'rods' },
    { name: 'Fishing Lures', slug: 'lures' },
  ],
};
