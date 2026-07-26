import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="global-footer" className="bg-[#0A0B0D] text-[#E4E6EB] border-t border-white/[0.06] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 gap-2 text-center sm:text-left">
            <Link to="/" className="flex items-center space-x-1 font-sans font-bold text-lg tracking-[0.2em] text-white">
              <span>LUCANA</span>
              <span className="w-1.5 h-1.5 bg-[#C62828] rounded-full"></span>
            </Link>
            <span className="hidden sm:inline-block h-4 w-px bg-white/10"></span>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
              Elite Casting Systems & Tournament Gear
            </p>
          </div>

          {/* Links Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            <Link to="/shop" className="hover:text-white transition-colors duration-150">Shop</Link>
            <Link to="/about" className="hover:text-white transition-colors duration-150">About</Link>
            <a href="#shipping" className="hover:text-white transition-colors duration-150">Shipping</a>
            <a href="#returns" className="hover:text-white transition-colors duration-150">Returns</a>
            <a href="#privacy" className="hover:text-white transition-colors duration-150">Privacy</a>
          </div>
        </div>

        {/* Bottom copyright / minimal metadata */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-medium">
          <div>
            &copy; {new Date().getFullYear()} Lucana Fishing Gear Ltd. All rights reserved.
          </div>
          <div className="text-gray-600 uppercase font-mono tracking-widest text-[9px]">
            TOKYO &bull; SEATTLE &bull; SYDNEY
          </div>
        </div>
      </div>
    </footer>
  );
};
