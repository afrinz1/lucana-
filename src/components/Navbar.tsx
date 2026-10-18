import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { categories } from '../utils/productUtils';
import logo from '../assets/images/logo.png';

export const Navbar: React.FC = () => {
  const { cartCount, setCartOpen, searchQuery, setSearchQuery } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isOverHomeHero = location.pathname === '/' && !isScrolled;
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle header scroll transparency and shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers/menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Synchronize local search state with context search query
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(localSearch)}`);
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  // Safe timer-based dropdown events to avoid instant flickers
  const openCategories = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsCategoriesOpen(true);
  };

  const closeCategories = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <header
        id="main-nav-header"
        className={`fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-2xl md:rounded-full backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? 'bg-transparent py-3.5 border border-transparent shadow-none'
            : 'bg-transparent py-5 border border-transparent shadow-none'
        }`}
      >
      <div className="mx-auto px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-3 items-center w-full">
          
          {/* Left Column: Hamburger toggle on mobile, Desktop Navigation Links on desktop */}
          <div className="flex items-center justify-start">
            {/* Mobile Hamburger toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsSearchOpen(false);
              }}
              className={`md:hidden p-2 rounded-full transition-all duration-200 cursor-pointer ${
                isOverHomeHero ? 'text-white hover:bg-white/15' : 'text-gray-800 hover:bg-gray-50'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-bold uppercase tracking-wider">
              <Link
                id="nav-link-home"
                to="/"
                className={`relative py-2 transition-colors duration-200 ${
                  isOverHomeHero
                    ? `text-white hover:text-white ${location.pathname === '/' ? 'font-black' : ''}`
                    : `text-gray-500 hover:text-gray-950 ${location.pathname === '/' ? 'text-gray-950 font-black' : ''}`
                }`}
              >
                <span>Home</span>
                {location.pathname === '/' && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C62828] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
              
              <Link
                id="nav-link-shop"
                to="/shop"
                className={`relative py-2 transition-colors duration-200 ${
                  isOverHomeHero
                    ? `text-white hover:text-white ${location.pathname === '/shop' ? 'font-black' : ''}`
                    : `text-gray-500 hover:text-gray-950 ${location.pathname === '/shop' ? 'text-gray-950 font-black' : ''}`
                }`}
              >
                <span>Shop All</span>
                {location.pathname === '/shop' && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C62828] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
              
              {/* Categories Dropdown Container */}
              <div
                className="relative py-2"
                onMouseEnter={openCategories}
                onMouseLeave={closeCategories}
              >
                <button
                  id="nav-btn-categories"
                  className={`flex items-center space-x-1 transition-colors duration-200 uppercase tracking-wider text-xs font-bold cursor-pointer ${
                    isOverHomeHero
                      ? `text-white hover:text-white ${location.pathname.startsWith('/category/') ? 'font-black' : ''}`
                      : `text-gray-500 hover:text-gray-950 ${location.pathname.startsWith('/category/') ? 'text-gray-950 font-black' : ''}`
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                      isCategoriesOpen
                        ? 'rotate-180 text-[#C62828]'
                        : isOverHomeHero ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </button>

                {/* Smooth Animated Dropdown Container */}
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80 z-50 pointer-events-auto"
                    >
                      <div className="bg-white rounded-2xl shadow-[0_10px_35px_-6px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.04)] border border-gray-100 p-2 overflow-hidden">
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1.5 font-extrabold border-b border-gray-50 mb-1">
                          Rigging Collections
                        </div>
                        <div className="space-y-0.5">
                          {categories.map(cat => {
                            const isActive = location.pathname === `/category/${cat.id}`;
                            return (
                              <Link
                                key={cat.id}
                                id={`nav-cat-link-${cat.id}`}
                                to={`/category/${cat.id}`}
                                onClick={() => setIsCategoriesOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item ${
                                  isActive ? 'bg-gray-50' : 'hover:bg-gray-50/70'
                                }`}
                              >
                                <div>
                                  <p className={`font-bold text-sm text-gray-900 group-hover/item:text-[#C62828] transition-colors duration-150 ${isActive ? 'text-[#C62828]' : ''}`}>
                                    {cat.name}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 font-medium">{cat.description}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-[#C62828] group-hover/item:translate-x-1 transition-all duration-200 ease-out" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                id="nav-link-about"
                to="/about"
                className={`relative py-2 transition-colors duration-200 ${
                  isOverHomeHero
                    ? `text-white hover:text-white ${location.pathname === '/about' ? 'font-black' : ''}`
                    : `text-gray-500 hover:text-gray-950 ${location.pathname === '/about' ? 'text-gray-950 font-black' : ''}`
                }`}
              >
                <span>About</span>
                {location.pathname === '/about' && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C62828] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </nav>
          </div>

          {/* Center Column: Logo */}
          <div className="flex items-center justify-center">
            <Link
              id="brand-logo"
              to="/"
              className="group flex items-center shrink-0"
              onClick={() => {
                setSearchQuery('');
                setLocalSearch('');
              }}
            >
              <img
                src={logo}
                alt="Lucana logo"
                className={`h-8 w-auto sm:h-9 md:h-10 object-contain ${isOverHomeHero ? 'brightness-0 invert' : ''}`}
              />
            </Link>
          </div>

          {/* Right Column: Search bar and Shopping Cart button */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3">
            {/* Desktop Search Capsule */}
            <div className="flex-1 max-w-[180px] lg:max-w-xs hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <motion.div
                  animate={{
                    scale: isSearchFocused ? 1.015 : 1,
                    boxShadow: isSearchFocused ? '0 4px 12px -2px rgba(0,0,0,0.04)' : '0 0px 0px rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative flex items-center"
                >
                  <input
                    id="desktop-search-input"
                    type="text"
                    placeholder="Search reels, rods, lines..."
                    value={localSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChange={e => setLocalSearch(e.target.value)}
                    className={`w-full border rounded-full py-1.5 pl-9 pr-8 text-[11px] font-semibold focus:outline-none transition-all duration-300 ${
                      isOverHomeHero
                        ? `text-white placeholder:text-white/65 ${
                            isSearchFocused
                              ? 'bg-black/35 border-white/70'
                              : 'bg-black/20 hover:bg-black/30 border-white/40'
                          }`
                        : `text-gray-800 placeholder-gray-400 ${
                            isSearchFocused
                              ? 'bg-white border-gray-900'
                              : 'bg-gray-50/70 hover:bg-gray-100/70 border-gray-200/80'
                          }`
                    }`}
                  />
                  <Search className={`absolute left-3 w-3.5 h-3.5 transition-colors duration-300 ${
                    isOverHomeHero ? 'text-white' : isSearchFocused ? 'text-gray-900' : 'text-gray-400'
                  }`} />
                  
                  {localSearch && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`absolute right-3.5 text-[9px] font-extrabold uppercase tracking-wider cursor-pointer ${
                        isOverHomeHero ? 'text-white/75 hover:text-white' : 'text-gray-400 hover:text-gray-950'
                      }`}
                    >
                      Clear
                    </button>
                  )}
                </motion.div>
              </form>
            </div>

            {/* Mobile Search Indicator */}
            <button
              id="mobile-search-toggle"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMenuOpen(false);
              }}
              className={`md:hidden p-2 rounded-full transition-colors cursor-pointer ${
                isOverHomeHero
                  ? 'text-white hover:text-white hover:bg-white/15'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'
              }`}
              aria-label="Toggle Mobile Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Shopping Cart Button */}
            <motion.button
              id="nav-cart-trigger"
              onClick={() => setCartOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-2 rounded-full transition-all duration-200 cursor-pointer animate-none ${
                isOverHomeHero
                  ? 'text-white hover:text-white hover:bg-white/15'
                  : 'text-gray-900 hover:text-[#C62828] hover:bg-gray-50'
              }`}
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#C62828] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

        </div>

        {/* Mobile Search Bar Expansion */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden sm:hidden"
            >
              <div className="py-3 border-t border-gray-100 mt-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    id="mobile-search-input"
                    type="text"
                    placeholder="Search reels, rods, lines..."
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-200"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3.5 top-3.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>

    {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="bg-white w-[85%] max-w-xs h-full shadow-2xl flex flex-col justify-between overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              <div>
                {/* Drawer Header with Title and close button */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <Link
                    to="/"
                    className="flex items-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setSearchQuery('');
                      setLocalSearch('');
                    }}
                  >
                    <img
                      src={logo}
                      alt="Lucana logo"
                      className="h-7 w-auto object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 -mr-2 text-gray-400 hover:text-gray-950 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-3">NAVIGATION</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          location.pathname === '/' ? 'bg-[#C62828] text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span>Home</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                      <Link
                        to="/shop"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          location.pathname === '/shop' ? 'bg-[#C62828] text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span>Shop All</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          location.pathname === '/about' ? 'bg-[#C62828] text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span>About</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-3">CATEGORIES</p>
                    <div className="space-y-1.5">
                      {categories.map(cat => {
                        const isActive = location.pathname === `/category/${cat.id}`;
                        return (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-150 ${
                              isActive
                                ? 'bg-gray-900 text-white font-extrabold'
                                : 'hover:bg-gray-50 text-gray-700 font-semibold'
                            }`}
                          >
                            <span className="text-xs uppercase tracking-wider">{cat.name}</span>
                            <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                <span>LUCANA PRESTIGE</span>
                <span>EST. 2026</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
