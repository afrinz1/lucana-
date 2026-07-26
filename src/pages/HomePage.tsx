import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Anchor, Sparkles, Shield, ChevronLeft, ChevronRight, ArrowUpRight, Star, Trophy, Target, Activity, Calendar } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { getFeaturedProducts, categories, featured } from '../utils/productUtils';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import heroVideo from "../assets/hero/hero.webm";

export const HomePage: React.FC = () => {
  const { setSearchQuery } = useShop();
  const navigate = useNavigate();

  const bestSellers = getFeaturedProducts('best_sellers');
  const newArrivals = getFeaturedProducts('new_arrivals');
  const featuredTackle = getFeaturedProducts('featured');

  // Parallax Scroll Effects
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 150]);
  const yContent = useTransform(scrollY, [0, 800], [0, -40]);
  const opacityBg = useTransform(scrollY, [0, 600], [1, 0.55]);

  return (
    <div id="home-page" className="bg-[#FAF9F9] min-h-screen">
      <SEO 
        title="Lucana | High-Performance Fishing Tackle & Premium Rigging"
        description="Discover elite-engineered saltwater reels, custom rods, and heavy-duty braided lines designed for the tournament trail. Crafted from Japanese carbon composite materials."
        keywords="fishing tackle, fishing rods, saltwater reels, elite rigging, Lucana tackle, braided line"
      />
      
      {/* 1. High-Fashion Premium Bento Hero Section */}
      <section 
        id="aeline-hero" 
        style={{ 
          marginTop: 'var(--navbar-height, 80px)',
          minHeight: 'calc(100vh - var(--navbar-height, 80px))' 
        }}
        className="relative w-full flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#0F0F10] via-[#18181B] to-[#27272A] text-white py-12 md:py-16 lg:py-20 border-b border-white/10"
      >
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --navbar-height: 72px;
          }
          @media (min-width: 768px) {
            :root {
              --navbar-height: 80px;
            }
          }
        `}} />
        
        {/* Subtle Radial Gradient Overlay for Luxury Lighting */}
        <div className="absolute inset-0 bg-radial-at-t from-white/5 via-transparent to-black/40 pointer-events-none" />
        
        {/* Angler Hero Photo blended smoothly across the entire background space */}
        <motion.div
          style={{ y: yBg, opacity: opacityBg }}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40 lg:opacity-65"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F10]/95 via-[#0F0F10]/80 to-[#0F0F10]/40 z-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10]/40 via-transparent to-black/35 z-20" />

          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center scale-105"
          >
            <source src={heroVideo} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Container aligning with 7xl limit but allowing full-bleed background */}
        <motion.div 
          style={{ y: yContent }}
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12"
        >
          
          {/* Left Block: Watch Pill + Massive Heading */}
          <div className="flex-1 space-y-6 md:space-y-8 max-w-2xl">
            {/* Elegant Watch Demo style Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all p-1.5 pr-4 rounded-full border border-white/10 shadow-lg cursor-pointer space-x-3.5 group"
            >
              <span className="text-[10px] sm:text-[11px] font-bold text-white/95 pl-3 uppercase tracking-[0.15em]">
                Watch Casting Lab
              </span>
              <div className="relative w-12 h-7 rounded-lg overflow-hidden bg-gray-950 shrink-0 border border-white/20">
                <img 
                  src="/src/assets/images/lucana_hero_model_1783764022045.jpg" 
                  alt="Lab video preview" 
                  className="w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md">
                    <span className="border-y-[3px] border-y-transparent border-l-[5px] border-l-[#C62828] ml-0.5"></span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Massive modern Title styled like the image */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="font-sans font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white"
            >
              Engineered casting <br className="hidden sm:block" />
              systems without <br className="hidden sm:block" />
              limits
            </motion.h1>
          </div>

          {/* Right Block: Paragraph explanation + Design button */}
          <div className="w-full md:w-80 lg:w-96 space-y-5 shrink-0 md:mb-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xs sm:text-sm text-white/75 leading-relaxed font-normal"
            >
              Lucana helps tournament anglers turn high-performance carbon setups into seamless field achievements—no compromises required. Share insights, not excuses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full border border-white/20 shadow-lg transition-all duration-200 cursor-pointer w-full justify-between sm:w-auto sm:justify-start"
              >
                <span>Design your first rig</span>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-md">
                  <ArrowUpRight className="w-3 h-3 stroke-[3.5]" />
                </div>
              </Link>
            </motion.div>
          </div>

        </motion.div>
      </section>

      {/* Minimal Continuous Sideways Scrolling Marquee */}
      <div className="w-full bg-white py-2 overflow-hidden border-y border-gray-100/60 relative z-20">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-marquee-continuous {
            animation: marquee-scroll 48s linear infinite;
          }
        `}} />
        <div className="flex w-max overflow-hidden select-none">
          <div className="animate-marquee-continuous flex whitespace-nowrap gap-8 py-0.5 shrink-0">
            {/* 3 identical copies to guarantee absolute continuity and support any screen width cleanly */}
            {Array(3).fill(["hook", "lines", "lures", "reels", "rods", "lucana"]).flat().map((text, idx) => (
              <span key={idx} className="flex items-center space-x-8 shrink-0">
                <span className="text-gray-400/80 uppercase tracking-[0.3em] font-sans font-bold text-[9px] sm:text-[10px] hover:text-[#C62828] transition-colors duration-200">
                  {text}
                </span>
                <span className="w-1 h-1 bg-[#C62828]/60 rounded-full shrink-0"></span>
              </span>
            ))}
            {Array(3).fill(["hook", "lines", "lures", "reels", "rods", "lucana"]).flat().map((text, idx) => (
              <span key={`dup1-${idx}`} className="flex items-center space-x-8 shrink-0">
                <span className="text-gray-400/80 uppercase tracking-[0.3em] font-sans font-bold text-[9px] sm:text-[10px] hover:text-[#C62828] transition-colors duration-200">
                  {text}
                </span>
                <span className="w-1 h-1 bg-[#C62828]/60 rounded-full shrink-0"></span>
              </span>
            ))}
            {Array(3).fill(["hook", "lines", "lures", "reels", "rods", "lucana"]).flat().map((text, idx) => (
              <span key={`dup2-${idx}`} className="flex items-center space-x-8 shrink-0">
                <span className="text-gray-400/80 uppercase tracking-[0.3em] font-sans font-bold text-[9px] sm:text-[10px] hover:text-[#C62828] transition-colors duration-200">
                  {text}
                </span>
                <span className="w-1 h-1 bg-[#C62828]/60 rounded-full shrink-0"></span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Featured Categories Grid */}
      <section id="categories-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-xs font-bold text-[#C62828] tracking-widest uppercase">PRECISION COLLECTIONS</p>
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-gray-950 mt-2 tracking-tight">
            FEATURED CATEGORIES
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-4 leading-relaxed font-medium">
            Every product in our catalog is engineered to tournament standards, ensuring maximum performance, lifespan, and casting precision.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        >
          {categories.map(cat => (
            <motion.div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
              }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative h-64 sm:h-85 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-sm transition-shadow duration-300 hover:shadow-xl cursor-pointer"
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              {/* Backing Cover with deep gradient for clean contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Text Layout */}
              <div className="absolute inset-0 z-20 p-4 sm:p-6 flex flex-col justify-end">
                <p className="text-[9px] sm:text-[10px] font-extrabold text-[#C62828] tracking-widest uppercase mb-0.5 sm:mb-1">
                  COLLECTION
                </p>
                <h3 className="font-sans font-extrabold text-sm sm:text-xl text-white tracking-tight uppercase line-clamp-1 sm:line-clamp-none">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-300 font-medium mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <span className="flex items-center space-x-1 sm:space-x-1.5 text-[#FAF9F9] group-hover:text-[#C62828] transition-colors duration-150 text-[10px] sm:text-[11px] font-extrabold">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                  <span className="text-gray-400 font-mono text-[9px] sm:text-[10px] bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shrink-0">
                    {cat.subcategories.length} SER.
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Why Choose Lucana - Value Proposition */}
      <section id="value-proposition" className="py-24 sm:py-32 bg-[#FAF8F5] border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Column (Editorial Title / Lead Message) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 pr-0 lg:pr-12 pb-12 lg:pb-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-300"
            >
              <div className="space-y-6">
                <p className="text-[10px] font-extrabold text-gray-400 tracking-[0.25em] uppercase">
                  ENGINEERING ETHOS
                </p>
                <h2 className="font-sans font-black text-3xl sm:text-4xl text-gray-950 leading-[1.1] uppercase tracking-tight">
                  Why Choose <br />
                  Lucana Tackle <span className="text-[#C62828]">✳</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal max-w-sm">
                  We do not build disposable gear. Our manufacturing centers combine aerospace carbon blanks, fully sealed IPX7 waterproof bearing vaults, and progressive carbon-disc drag assemblies.
                </p>
              </div>
              <div className="pt-8">
                <Link
                  id="value-prop-workshop"
                  to="/shop"
                  className="inline-flex items-center space-x-2 text-[11px] font-bold text-gray-950 uppercase tracking-widest border-b border-gray-950 pb-1 hover:text-[#C62828] hover:border-[#C62828] transition-all duration-200 cursor-pointer"
                >
                  <span>Visit Lucana Workshop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column (2x2 Grid with Thin Partition Borders) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2">
              
              {/* Grid Box 1 (Top Left) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-8 sm:p-12 flex flex-col justify-between space-y-8 border-b sm:border-r border-gray-300 group"
              >
                {/* Overlapping Circles Icon */}
                <div className="h-16 flex items-center">
                  <svg viewBox="0 0 100 100" className="w-14 h-14 text-gray-400 group-hover:text-[#C62828] transition-colors duration-500 stroke-[1] stroke-current fill-none">
                    <circle cx="35" cy="50" r="20" />
                    <circle cx="50" cy="50" r="20" />
                    <circle cx="65" cy="50" r="20" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider block">01 / TECHNOLOGY</span>
                  <h4 className="font-sans font-black text-base text-gray-950 tracking-tight uppercase group-hover:text-[#C62828] transition-colors duration-300">
                    Japanese Carbon Blanks
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    Rods manufactured exclusively with 40-ton Toray carbon fiber sheets wrapped at cross-helical pitches for superior sensitivity.
                  </p>
                </div>
              </motion.div>

              {/* Grid Box 2 (Top Right) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-8 sm:p-12 flex flex-col justify-between space-y-8 border-b border-gray-300 group"
              >
                {/* Staggered Triangles Icon */}
                <div className="h-16 flex items-center">
                  <svg viewBox="0 0 120 100" className="w-16 h-14 text-gray-400 group-hover:text-[#C62828] transition-colors duration-500 stroke-[1] stroke-current fill-none">
                    <polygon points="10,80 35,25 60,80" />
                    <polygon points="25,80 50,25 75,80" />
                    <polygon points="40,80 65,25 90,80" />
                    <polygon points="55,80 80,25 105,80" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider block">02 / PROTECTION</span>
                  <h4 className="font-sans font-black text-base text-gray-950 tracking-tight uppercase group-hover:text-[#C62828] transition-colors duration-300">
                    IPX6 / IPX7 Sealing
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    Fully sealed drag washers, drive gearing, and pinions protect your reels from harsh saltwater intrusion and corrosion.
                  </p>
                </div>
              </motion.div>

              {/* Grid Box 3 (Bottom Left) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-8 sm:p-12 flex flex-col justify-between space-y-8 border-b sm:border-b-0 sm:border-r border-gray-300 group"
              >
                {/* Concentric Rings with Axial Line Icon */}
                <div className="h-16 flex items-center">
                  <svg viewBox="0 0 100 100" className="w-14 h-14 text-gray-400 group-hover:text-[#C62828] transition-colors duration-500 stroke-[1] stroke-current fill-none">
                    <circle cx="50" cy="50" r="38" />
                    <circle cx="50" cy="50" r="30" />
                    <circle cx="50" cy="50" r="22" />
                    <circle cx="50" cy="50" r="14" />
                    <circle cx="50" cy="50" r="6" />
                    <line x1="50" y1="12" x2="50" y2="88" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider block">03 / PERFORMANCE</span>
                  <h4 className="font-sans font-black text-base text-gray-950 tracking-tight uppercase group-hover:text-[#C62828] transition-colors duration-300">
                    Tournament Caliber
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    Tolerances dialed down to 0.005mm in all CNC gear teeth meshes ensure lifetime smoothness and minimal gear chatter.
                  </p>
                </div>
              </motion.div>

              {/* Grid Box 4 (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-8 sm:p-12 flex flex-col justify-between space-y-8 group"
              >
                {/* Astroid / 4-point Star Icon */}
                <div className="h-16 flex items-center">
                  <svg viewBox="0 0 100 100" className="w-14 h-14 text-gray-400 group-hover:text-[#C62828] transition-colors duration-500 stroke-[1] stroke-current fill-none">
                    <path d="M50 10 Q50 50 10 50 Q50 50 50 90 Q50 50 90 50 Q50 50 50 10 Z" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider block">04 / GUARANTEE</span>
                  <h4 className="font-sans font-black text-base text-gray-950 tracking-tight uppercase group-hover:text-[#C62828] transition-colors duration-300">
                    3-Year Warranty
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    Lucana stands behind its craftsmanship. We offer a full 3-year warranty covering material failure on all reels.
                  </p>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. New Arrivals Promotional Strip */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        id="new-arrivals-section"
        className="py-20 bg-gray-950 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-12 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs font-bold text-[#C62828] tracking-widest uppercase">FRESH CUT RELEASES</p>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mt-1.5 uppercase tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-white hover:text-[#C62828] flex items-center space-x-1 uppercase tracking-wider transition-colors"
            >
              <span>EXPLORE ALL RELEASES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {newArrivals.map(product => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                }}
                className="text-gray-900 flex flex-col h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. Promotional Callout */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        id="promo-callout"
        className="relative py-24 bg-gray-100 overflow-hidden border-t border-gray-200/30"
      >
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10"
        />
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight uppercase leading-tight"
          >
            Gear Up for Your Next Grand Slam Catch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs sm:text-sm md:text-base text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            From deep-sea marlin trolling lines to sensitive stream fly-casting reels, Lucana's proprietary catalog provides custom setups for every biome and target species.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="pt-2 inline-block"
          >
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-lg transition-colors duration-250 shadow-xl inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>START CUSTOM RIGGING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
};
