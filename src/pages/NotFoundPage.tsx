import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, ArrowRight, Compass } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div id="not-found-page" className="bg-[#FAF9F9] min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <SEO
        title="Page Not Found | Lucana"
        description="The page you are looking for doesn't exist or may have been moved. Explore premium fishing tackle at Lucana."
        robots="noindex, nofollow"
      />
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto border border-gray-100">
          <Anchor className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-[#C62828] tracking-[0.3em] uppercase">Error 404</p>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-gray-950 uppercase tracking-tight">
            Lost at Sea
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            The page or tackle you're looking for doesn't exist in our systems. It may have been
            retired, renamed, or simply drifted away with the current.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex-1 py-3.5 bg-gray-950 hover:bg-[#C62828] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 uppercase"
          >
            <Compass className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/shop"
            className="flex-1 py-3.5 bg-white border border-gray-200 hover:border-gray-900 text-gray-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 uppercase"
          >
            <span>Explore the Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
