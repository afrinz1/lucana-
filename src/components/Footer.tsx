import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { categories } from '../utils/productUtils';

export const Footer: React.FC = () => {
  return (
    <footer id="global-footer" className="bg-white text-[#111111] border-t border-black/[0.08] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 gap-2 text-center sm:text-left">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Lucana logo" className="h-7 w-auto object-contain" />
            </Link>
            <span className="hidden sm:inline-block h-4 w-px bg-white/10"></span>
            <p className="text-[11px] text-gray-600 font-medium tracking-wide">
              Elite Casting Systems & Tournament Gear
            </p>
          </div>

          {/* Links Row — real internal routes only (no dead anchors) */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-gray-600 font-bold uppercase tracking-wider">
            <Link to="/shop" className="hover:text-black transition-colors duration-150">Shop</Link>
            <Link to="/checkout" className="hover:text-black transition-colors duration-150">Checkout</Link>
            <Link to="/about" className="hover:text-black transition-colors duration-150">About</Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="hover:text-black transition-colors duration-150"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom copyright / minimal metadata */}
        <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-medium">
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
