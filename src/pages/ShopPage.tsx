import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products, categories, filterProducts, sortProducts, getPriceBounds } from '../utils/productUtils';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEO } from '../components/SEO';

export const ShopPage: React.FC = () => {
  const { searchQuery, setSearchQuery } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Core Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(() => searchParams.get('brand') || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Price Range Bounds State
  const bounds = useMemo(() => getPriceBounds(products), []);
  const [priceRange, setPriceRange] = useState<[number, number]>(bounds);

  // Category product counts (computed once for the sidebar)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Single source of truth: URL params drive the filter state (and reset pagination)
  useEffect(() => {
    const catParam = searchParams.get('category');
    setSelectedCategory(catParam || 'all');
    const brandParam = searchParams.get('brand');
    setSelectedBrand(brandParam || 'all');
    const searchParam = searchParams.get('search');
    if (searchParam !== null) setSearchQuery(searchParam);
    setCurrentPage(1);
  }, [searchParams, setSearchQuery]);

  // Update query params when categories or brands are selected
  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
  };

  // Reset all filters helper
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange(bounds);
    setSortBy('featured');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Handle Quick Price Bracket clicks
  const applyPriceBracket = (min: number, max: number) => {
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  // Apply filters and sort to the master product list
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      category: selectedCategory,
      brand: selectedBrand,
      priceRange: priceRange,
      search: searchQuery,
    });
    return sortProducts(filtered, sortBy);
  }, [selectedCategory, selectedBrand, priceRange, searchQuery, sortBy]);

  // Paginated chunk calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  
  // Make sure page is in bounds if list shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredProducts.length, currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Dynamic SEO title & description based on filters
  const categoryTitle = selectedCategory !== 'all' ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ` : '';
  const brandTitle = selectedBrand !== 'all' ? `by ${selectedBrand} ` : '';
  const seoTitle = `Shop ${categoryTitle}${brandTitle}Fishing Tackle | Lucana`;
  const seoDesc = `Explore the best tournament-grade fishing tackle catalog.${selectedCategory !== 'all' ? ` Browse premium ${selectedCategory} built with ultimate durability.` : ''}`;

  return (
    <div id="shop-page" className="bg-[#FAF9F9] min-h-screen pt-24 pb-20">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords="buy fishing gear, premium reels, saltwater rods, tackle shop, terminal tackle"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Search Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Breadcrumbs
              items={[
                { name: 'Home', to: '/' },
                { name: 'Shop Gear' },
              ]}
              className="mb-3"
            />
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950 mt-2">
              Explore Lucana Tackle
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Showing {filteredProducts.length} of {products.length} elite tackle products
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="w-full md:max-w-md relative">
            <input
              id="shop-search-bar"
              type="text"
              placeholder="Search by product, brand or tags..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pl-12 pr-10 text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-200"
            />
            <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-gray-400 hover:text-gray-900 font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Outer Layout wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. Sidebar Filters (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-sans font-bold text-gray-900 text-sm tracking-wider uppercase flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C62828]" />
                <span>Filters</span>
              </h3>
              <button
                id="reset-filters-btn"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-gray-400 hover:text-[#C62828] flex items-center space-x-1 uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Categories — real links for crawlable internal linking */}
            <div className="space-y-3.5">
              <h4 className="font-bold text-gray-900 text-xs tracking-wider uppercase">Category</h4>
              <div className="space-y-1.5 text-sm text-gray-600">
                <Link
                  to="/shop"
                  className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === 'all' ? 'bg-gray-900 text-white shadow-sm' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="font-mono text-[10px] text-gray-400">{products.length}</span>
                </Link>
                {categories.map(cat => {
                  const count = categoryCounts[cat.id] || 0;
                  const active = selectedCategory === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${cat.id}`}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        active ? 'bg-gray-900 text-white shadow-sm' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`font-mono text-[10px] ${active ? 'text-gray-300' : 'text-gray-400'}`}>
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Brackets */}
            <div className="space-y-3.5 pb-2">
              <h4 className="font-bold text-gray-900 text-xs tracking-wider uppercase">Price Bracket</h4>
              
              {/* Range display slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min={bounds[0]}
                  max={bounds[1]}
                  value={priceRange[1]}
                  onChange={e => {
                    setPriceRange([priceRange[0], parseFloat(e.target.value)]);
                    setCurrentPage(1);
                  }}
                  className="w-full accent-gray-900 h-1 bg-gray-100 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Min: ${priceRange[0]}</span>
                  <span>Max: ${priceRange[1]}</span>
                </div>
              </div>

              {/* Quick Bracket Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => applyPriceBracket(0, 30)}
                  className="text-[10px] font-bold border border-gray-200 hover:border-gray-900 rounded px-2.5 py-1.5 bg-gray-50/50 transition-all uppercase"
                >
                  Under $30
                </button>
                <button
                  onClick={() => applyPriceBracket(30, 100)}
                  className="text-[10px] font-bold border border-gray-200 hover:border-gray-900 rounded px-2.5 py-1.5 bg-gray-50/50 transition-all uppercase"
                >
                  $30 to $100
                </button>
                <button
                  onClick={() => applyPriceBracket(100, 250)}
                  className="text-[10px] font-bold border border-gray-200 hover:border-gray-900 rounded px-2.5 py-1.5 bg-gray-50/50 transition-all uppercase"
                >
                  $100 to $250
                </button>
                <button
                  onClick={() => applyPriceBracket(250, bounds[1])}
                  className="text-[10px] font-bold border border-gray-200 hover:border-gray-900 rounded px-2.5 py-1.5 bg-gray-50/50 transition-all uppercase"
                >
                  Over $250
                </button>
              </div>
            </div>
          </aside>

          {/* B. Products Content Area */}
          <main className="col-span-1 lg:col-span-9 space-y-6">
            
            {/* Control Strip */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              
              {/* Mobile Filter Toggle */}
              <button
                id="mobile-filter-trigger"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 uppercase transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C62828]" />
                <span>Filters ({selectedCategory !== 'all' ? 'Active' : 'All'})</span>
              </button>

              <div className="flex items-center space-x-2.5">
                <span className="text-xs text-gray-400 font-bold uppercase">Sort By</span>
                <select
                  id="sort-dropdown"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-gray-900 focus:bg-white"
                >
                  <option value="featured">Featured Tackle</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="discount">Biggest Discounts</option>
                </select>
              </div>

              {/* Grid / List Toggles */}
              <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50/50">
                <button
                  id="grid-layout-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  id="list-layout-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-start animate-fadeIn">
                <div className="bg-white w-4/5 max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="font-bold text-gray-900 text-sm tracking-widest uppercase">Filters</h3>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase"
                      >
                        Close
                      </button>
                    </div>

                    {/* Reset All on Mobile */}
                    <button
                      onClick={() => {
                        handleResetFilters();
                        setShowMobileFilters(false);
                      }}
                      className="w-full py-2.5 border border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:text-[#C62828] flex items-center justify-center space-x-1 uppercase"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>

                    {/* Category */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-xs tracking-wider uppercase">Category</h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => { handleCategorySelect('all'); setShowMobileFilters(false); }}
                          className={`px-3 py-2 rounded-lg text-[10px] font-bold border text-center transition-all ${
                            selectedCategory === 'all' ? 'bg-gray-900 text-white border-transparent' : 'border-gray-150 text-gray-700'
                          }`}
                        >
                          All Tackle
                        </button>
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => { handleCategorySelect(cat.id); setShowMobileFilters(false); }}
                            className={`px-3 py-2 rounded-lg text-[10px] font-bold border text-center transition-all ${
                              selectedCategory === cat.id ? 'bg-gray-900 text-white border-transparent' : 'border-gray-150 text-gray-700'
                            }`}
                          >
                            {cat.name.split(' ').pop()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 text-xs tracking-wider uppercase">Price Limit</h4>
                      <input
                        type="range"
                        min={bounds[0]}
                        max={bounds[1]}
                        value={priceRange[1]}
                        onChange={e => {
                          setPriceRange([priceRange[0], parseFloat(e.target.value)]);
                        }}
                        className="w-full accent-gray-900 h-1 bg-gray-100 rounded-lg"
                      />
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Max Price: ${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-3 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-lg mt-8"
                  >
                    APPLY FILTERS
                  </button>
                </div>
              </div>
            )}

            {/* Empty State / Products Display */}
            {filteredProducts.length === 0 ? (
              <div id="shop-empty-state" className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">No Tackle Matches Filters</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto leading-relaxed">
                  We couldn't find any fishing products matching your specific query. Try adjusting your price ranges or choosing "All Categories".
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-lg transition-all uppercase"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                id="products-display-grid"
                className={`grid gap-3 sm:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div id="pagination-controls" className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
                <button
                  id="prev-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={`p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ${
                    currentPage === 1 ? 'opacity-40 cursor-not-allowed hover:bg-white' : ''
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-600">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-lg border text-center transition-all ${
                        currentPage === pageNumber
                          ? 'bg-gray-900 text-white border-transparent font-extrabold shadow-sm'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  id="next-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={`p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ${
                    currentPage === totalPages ? 'opacity-40 cursor-not-allowed hover:bg-white' : ''
                  }`}
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};
