import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import logo from '../assets/images/logo.png';
import { categories, brands } from '../utils/productUtils';
import { SOCIAL_LINKS } from '../utils/siteConfig';

const SHOP_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'Shop All Tackle', to: '/shop' },
  { name: 'About Lucana', to: '/about' },
  { name: 'Checkout', to: '/checkout' },
];

const SOCIALS = [
  { name: 'Facebook', href: SOCIAL_LINKS.facebook, Icon: Facebook },
  { name: 'Instagram', href: SOCIAL_LINKS.instagram, Icon: Instagram },
  { name: 'Twitter / X', href: SOCIAL_LINKS.twitter, Icon: Twitter },
  { name: 'YouTube', href: SOCIAL_LINKS.youtube, Icon: Youtube },
];

export const Footer: React.FC = () => {
  return (
    <footer id="global-footer" className="bg-[#0F0F10] text-gray-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center" aria-label="Lucana home">
              <img src={logo} alt="Lucana logo" className="h-8 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
              Elite casting systems and tournament gear. Reels, rods, braided lines, hooks, lures and
              tackle bags engineered to tournament standards from Japanese Toray carbon.
            </p>
            <ul className="flex items-center gap-2.5" aria-label="Lucana on social media">
              {SOCIALS.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Lucana on ${name}`}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#C62828] hover:border-[#C62828] transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <nav className="lg:col-span-2" aria-label="Shop links">
            <h3 className="text-[10px] font-extrabold text-white uppercase tracking-[0.25em] mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(link => (
                <li key={link.to + link.name}>
                  <Link
                    to={link.to}
                    className="text-xs text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav className="lg:col-span-3" aria-label="Product categories">
            <h3 className="text-[10px] font-extrabold text-white uppercase tracking-[0.25em] mb-4">
              Shop by Category
            </h3>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Brands */}
          <nav className="lg:col-span-3" aria-label="Brands">
            <h3 className="text-[10px] font-extrabold text-white uppercase tracking-[0.25em] mb-4">
              Partner Brands
            </h3>
            <ul className="space-y-2.5">
              {brands.map(brand => (
                <li key={brand.id}>
                  <Link
                    to={`/brand/${brand.id}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  className="text-xs text-[#C62828] hover:text-white font-bold transition-colors duration-150"
                >
                  View All Gear →
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-medium">
          <div>
            &copy; {new Date().getFullYear()} Lucana Fishing Gear Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sitemap.xml" className="hover:text-gray-300 transition-colors">
              Sitemap
            </Link>
            <span className="text-gray-600 uppercase font-mono tracking-widest">
              TOKYO &bull; SEATTLE &bull; SYDNEY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
