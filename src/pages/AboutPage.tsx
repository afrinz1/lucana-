import React from 'react';
import { motion } from 'motion/react';
import { Compass, Hammer, Shield, Anchor, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="min-h-screen bg-[#FAF9F9] pt-24 pb-16 overflow-hidden">
      <SEO 
        title="Our Heritage & Vision | Lucana Tackle Co."
        description="Learn about the origin of Lucana. From a boutique saltwater machining workshop to an elite brand engineering 40-Ton carbon rods and CNC micro-tolerance reels."
        keywords="about lucana, fishing brand, premium fishing tackle heritage, precision manufacturing"
      />

      {/* Embedded CSS for custom self-contained keyframe animations (Scrolling Marquee & Rotating Starburst) */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee-scroll 25s linear infinite;
        }
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 40s linear infinite;
        }
      `}</style>
      
      {/* 1. High-Fashion Editorial Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-gray-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Editorial Greeting & Description */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold text-[#C62828] tracking-[0.25em] uppercase">
                    LUCANA TACKLE CO.
                  </span>
                  <span className="text-xs text-[#C62828]">✳</span>
                </div>
                
                <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-gray-950 tracking-tight leading-[1.05] uppercase">
                  WE ARE LUCANA. <br />
                  HIGH-PERFORMANCE <span className="text-[#C62828]">✳</span> TACKLE <br />
                  <span className="underline decoration-[#C62828]/60 decoration-4 text-gray-400">DESIGNED TO OUTLAST.</span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase divide-x divide-gray-200"
              >
                <span className="pr-4">PRECISION MANUFACTURING</span>
                <span className="px-4">MASTER CALIBRATION</span>
                <span className="px-4">SALT PROTECTION</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal max-w-xl"
              >
                For tournament professionals and demanding coastal anglers, Lucana designs high-performance tackle that challenges the margins of modern materials and mechanics. We construct gear that acts as an intuitive, responsive extension of your focus on the water.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  id="hero-about-shop"
                  to="/shop"
                  className="px-6 py-3.5 bg-gray-950 hover:bg-[#C62828] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <span>Explore Gear</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  id="hero-about-contact"
                  to="/checkout"
                  className="px-6 py-3.5 border border-gray-900 text-gray-900 hover:bg-gray-50 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-200"
                >
                  WhatsApp Ordering
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Circular Cropped Image with Animated Starburst Badge Backing */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
                
                {/* Rotating Starburst Gear/Badge */}
                <div className="absolute w-80 h-80 sm:w-[410px] sm:h-[410px] text-[#C62828]/8 animate-slow-spin select-none pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                    <path d="M50 0 L53 25 L70 7 L60 31 L88 18 L68 39 L100 50 L68 61 L88 82 L60 69 L70 93 L53 75 L50 100 L47 75 L30 93 L40 69 L12 82 L32 61 L0 50 L32 39 L12 18 L40 31 L30 7 L47 25 Z" />
                  </svg>
                </div>

                {/* Circular Portrait Image Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white shadow-[0_12px_40px_-15px_rgba(0,0,0,0.15)] z-10"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800"
                    alt="Lucana Pro Angler Rigging"
                    className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Absolute Floating Star Badge */}
                <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-12 h-12 bg-[#C62828] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg z-20">
                  ✳
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Slanted Continuous Text Ticker Ribbon */}
      <section className="relative z-20 -mt-3 mb-10 overflow-hidden py-4 bg-gray-950 text-white transform -rotate-1 md:-rotate-2 border-y-2 border-gray-900 shadow-xl">
        <div className="flex whitespace-nowrap overflow-hidden select-none">
          <div className="animate-marquee flex items-center space-x-12 uppercase tracking-[0.18em] text-[10px] sm:text-xs font-bold text-gray-100">
            <span>PRESTIGE REELS</span>
            <span className="text-[#C62828]">✳</span>
            <span>CASTING BLANKS</span>
            <span className="text-[#C62828]">✳</span>
            <span>JAPANESE TORAY CARBON</span>
            <span className="text-[#C62828]">✳</span>
            <span>TOURNAMENT READY CONFIGURATIONS</span>
            <span className="text-[#C62828]">✳</span>
            <span>IPX7 WATERPROOF SYSTEM</span>
            <span className="text-[#C62828]">✳</span>
            <span>CNC MICRO-TOLERANCES</span>
            <span className="text-[#C62828]">✳</span>
            
            {/* Duplicate for infinite loop */}
            <span>PRESTIGE REELS</span>
            <span className="text-[#C62828]">✳</span>
            <span>CASTING BLANKS</span>
            <span className="text-[#C62828]">✳</span>
            <span>JAPANESE TORAY CARBON</span>
            <span className="text-[#C62828]">✳</span>
            <span>TOURNAMENT READY CONFIGURATIONS</span>
            <span className="text-[#C62828]">✳</span>
            <span>IPX7 WATERPROOF SYSTEM</span>
            <span className="text-[#C62828]">✳</span>
            <span>CNC MICRO-TOLERANCES</span>
            <span className="text-[#C62828]">✳</span>
          </div>
        </div>
      </section>

      {/* 3. Split Intro & Heritage Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Label & Bold Statement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold text-[#C62828] tracking-[0.25em] uppercase">
                HERITAGE & VISION
              </p>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-gray-950 uppercase tracking-tight leading-tight">
                Designed to Outlast. <br />
                Master Calibration & Precision.
              </h2>
            </div>
            <div className="h-[2px] w-12 bg-gray-900" />
          </div>

          {/* Right Column: Paragraph narrative + Small Metadata rows */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
              <p>
                Lucana was founded with a singular, unyielding vision: to construct elite fishing equipment that matches the grit and determination of the tournament trail. We began as a boutique workshop machining specialized gear wheels for saltwater charters, refining drag mechanics to endure the raw power of deep-sea pelagics.
              </p>
              <p>
                Today, Lucana stands as a symbol of precision engineering. By fusing ultra-lightweight carbon compounds with marine-grade aviation alloys, we design reels and rods that give anglers total feedback, ultimate response, and absolute structural confidence on the water.
              </p>
            </div>

            {/* Quick Metadata blocks below */}
            <div className="pt-6 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-400">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider block text-[#C62828]">FOUNDED IN</span>
                <span className="text-xs sm:text-sm text-gray-900 font-bold block mt-1">2026 / SEATTLE, WA</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider block text-[#C62828]">CNC TOLERANCES</span>
                <span className="text-xs sm:text-sm text-gray-900 font-bold block mt-1">0.005mm MICRO-MILL</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider block text-[#C62828]">CARBON DENSITY</span>
                <span className="text-xs sm:text-sm text-gray-900 font-bold block mt-1">40-TON TORAY BLANKS</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Statistics Block (3 Segmented Grid) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-gray-950 grid grid-cols-1 md:grid-cols-3 rounded-none overflow-hidden divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-950 bg-white">
          
          {/* Segment 1 */}
          <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-gray-950 font-sans block tracking-tight">
                0.005mm
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-[#C62828] uppercase block mt-3">
                CNC MICRO-TOLERANCES
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              Internal gear alignments calibrated to microscopic levels to maximize load transition, gear mesh durability, and fluid cranking feedback.
            </p>
          </div>

          {/* Segment 2 - Inverted Color block */}
          <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-gray-950 text-white">
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-sans block tracking-tight">
                40-Ton
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-[#C62828] uppercase block mt-3">
                TORAY CARBON BLANKS
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              High-pressure heat-treated carbon polymers providing ultra-sensitive blank feedback while remaining completely rigid during deep-water hook sets.
            </p>
          </div>

          {/* Segment 3 */}
          <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-gray-950 font-sans block tracking-tight">
                IPX7
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-[#C62828] uppercase block mt-3">
                WATERPROOF SEALING
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              Heavy-duty multi-barrier seals sealing the main gear cavity and drag assembly from destructive marine-salt deposits and direct wave wash.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Pillars / Commitment Rows Section (Styled like the Awards block in the layout) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#C62828]/10 text-[#C62828] text-sm font-bold">
            ✳
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-gray-950 uppercase tracking-tight">
            Commitments & Standards
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
            PRECISION RIGGING AND RIGOROUS FIELD TESTING
          </p>
        </div>

        {/* Thick Border Row-Based Table Layout */}
        <div className="space-y-4 max-w-5xl mx-auto">
          
          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gray-200/80 rounded-xl p-6 sm:p-8 bg-white hover:border-gray-900 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-start sm:items-center space-x-6">
              {/* Number box block */}
              <div className="w-10 h-10 rounded-lg bg-[#C62828] flex items-center justify-center text-white font-bold text-xs shrink-0 select-none">
                01
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-gray-950 uppercase tracking-tight group-hover:text-[#C62828] transition-colors">
                  Computational Stress Mapping
                </h4>
                <p className="text-xs text-gray-400 max-w-xl font-normal leading-relaxed">
                  Tokyo design facility stress-maps composite materials, modeling raw elasticity arrays to guarantee zero-shatter under extreme deep-sea pelagic load peaks.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold tracking-widest text-[#C62828] uppercase block">ENGINEERING HUB</span>
              <span className="text-xs text-gray-400 block mt-1">TOKYO, JP / 2026</span>
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gray-200/80 rounded-xl p-6 sm:p-8 bg-white hover:border-gray-900 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-start sm:items-center space-x-6">
              {/* Number box block */}
              <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center text-white font-bold text-xs shrink-0 select-none">
                02
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-gray-950 uppercase tracking-tight group-hover:text-[#C62828] transition-colors">
                  Master Technician Hand Calibration
                </h4>
                <p className="text-xs text-gray-400 max-w-xl font-normal leading-relaxed">
                  Every high-capacity Lucana reel is assembled, hand-lubricated with high-viscosity marine grease, and load tested for instant anti-reverse accuracy.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold tracking-widest text-[#C62828] uppercase block">CALIBRATION DEPOT</span>
              <span className="text-xs text-gray-400 block mt-1">HAND TUNED / 2026</span>
            </div>
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gray-200/80 rounded-xl p-6 sm:p-8 bg-white hover:border-gray-900 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-start sm:items-center space-x-6">
              {/* Number box block */}
              <div className="w-10 h-10 rounded-lg bg-[#C62828] flex items-center justify-center text-white font-bold text-xs shrink-0 select-none">
                03
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-gray-950 uppercase tracking-tight group-hover:text-[#C62828] transition-colors">
                  Marine Salt Shield Guard
                </h4>
                <p className="text-xs text-gray-400 max-w-xl font-normal leading-relaxed">
                  Multi-barrier anti-corrosion oxide treatment and internal gasket defense arrays shield bearings and drives from destructive salt oxidation.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold tracking-widest text-[#C62828] uppercase block">SALT EVASION SYSTEM</span>
              <span className="text-xs text-gray-400 block mt-1">IPX7 BARRIER / 2026</span>
            </div>
          </motion.div>

          {/* Row 4 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gray-200/80 rounded-xl p-6 sm:p-8 bg-white hover:border-gray-900 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-start sm:items-center space-x-6">
              {/* Number box block */}
              <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center text-white font-bold text-xs shrink-0 select-none">
                04
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-gray-950 uppercase tracking-tight group-hover:text-[#C62828] transition-colors">
                  Prestige Field Guarantee
                </h4>
                <p className="text-xs text-gray-400 max-w-xl font-normal leading-relaxed">
                  Our products are tested on heavy-haul saltwater runs. We back every design blank and structural body with a full 3-year warranty limit.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold tracking-widest text-[#C62828] uppercase block">WARRANTY ASSURANCE</span>
              <span className="text-xs text-gray-400 block mt-1">3-YEAR LIMIT / 2026</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 6. Clean CTA Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="space-y-6">
          <div className="inline-flex w-8 h-8 rounded-full bg-[#C62828]/5 flex items-center justify-center text-[#C62828]">
            <Anchor className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-sans font-semibold text-2xl sm:text-3xl text-gray-950 uppercase tracking-tight">
            Ready to rig your setup?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-normal leading-relaxed">
            Explore our curated high-performance reels, tournament rod configurations, and durable braided lines.
          </p>
          <div className="pt-4">
            <Link
              id="about-cta-shop"
              to="/shop"
              className="inline-flex items-center space-x-2 text-[11px] font-bold text-gray-950 uppercase tracking-widest border-b border-gray-950 pb-1 hover:text-[#C62828] hover:border-[#C62828] transition-all duration-200 cursor-pointer"
            >
              <span>Explore The Gear Range</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
