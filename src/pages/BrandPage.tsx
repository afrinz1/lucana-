import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { getBrandBySlug, getProductsByBrand } from '../utils/productUtils';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEO } from '../components/SEO';

export const BrandPage: React.FC = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();

  const brand = useMemo(() => (brandSlug ? getBrandBySlug(brandSlug) : undefined), [brandSlug]);
  const brandProducts = useMemo(() => (brand ? getProductsByBrand(brand) : []), [brand]);

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center py-20 bg-gray-50 pt-28">
        <h2 className="text-xl font-bold text-gray-900">Brand Not Found</h2>
        <p className="text-sm text-gray-400 mt-1 max-w-sm">
          The requested brand doesn't exist in our catalog. Explore all of our collections instead.
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

  return (
    <div id="brand-page" className="bg-[#FAF9F9] min-h-screen pt-24 pb-20">
      <SEO
        title={`${brand.name} Fishing Tackle | Premium Gear`}
        description={brand.description}
        keywords={`${brand.name}, ${brand.name.toLowerCase()} fishing tackle, saltwater gear, premium rods, reels`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { name: 'Home', to: '/' },
            { name: 'Shop', to: '/shop' },
            { name: brand.name },
          ]}
          className="mb-6"
        />

        {/* Brand Hero */}
        <section className="bg-gray-950 text-white rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-900/40 z-10" />
          <div className="relative z-20 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-5">
              <div className="flex items-center space-x-2 text-[10px] font-extrabold text-[#C62828] tracking-[0.25em] uppercase">
                <BadgeCheck className="w-4 h-4" />
                <span>Partner Series Collection</span>
              </div>
              <h1 className="font-sans font-black text-4xl sm:text-5xl tracking-tight uppercase">
                {brand.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium max-w-xl">
                {brand.description}
              </p>
              <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 font-mono">
                <span className="bg-white/10 px-3 py-1 rounded-full text-white">
                  {brandProducts.length} PRODUCTS ONLINE
                </span>
              </div>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 text-[11px] font-bold text-white uppercase tracking-widest border-b border-white/40 pb-1 hover:text-[#C62828] hover:border-[#C62828] transition-all duration-200 self-start lg:self-auto"
            >
              <span>Browse All Gear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Products */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-gray-950">
              {brand.name} Collection
            </h2>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {brandProducts.length} products
            </span>
          </div>

          {brandProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg">No Tackle Registered Under This Series</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
                We're currently field-testing new releases for this series. Browse the full shop instead.
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
              {brandProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
