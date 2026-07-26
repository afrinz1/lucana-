import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useShop();

  const price = typeof product.price === 'number' ? product.price : 0;
  const discountPrice = typeof product.discount_price === 'number' ? product.discount_price : 0;
  const activePrice = discountPrice || price;
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const isOutOfStock = typeof product.stock === 'number' ? product.stock <= 0 : false;
  const mainImage = (product.images && product.images.length > 0 && product.images[0]) || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800";

  // Simulate rating
  const rating = (4.5 + (product.id % 6) * 0.1).toFixed(1);
  const reviewsCount = 12 + (product.id * 7) % 43;

  if (viewMode === 'list') {
    return (
      <div
        id={`product-card-list-${product.id}`}
        className="flex flex-col sm:flex-row bg-white rounded-none border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        {/* Product Image */}
        <div className="relative w-full sm:w-64 h-48 bg-gray-50 flex-shrink-0">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </Link>
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#C62828] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-none uppercase tracking-wider">
              Save ${(price - discountPrice).toFixed(0)}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm font-bold text-gray-500 uppercase tracking-wider">
              Out of Stock
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              {product.brand ? (
                <span className="font-semibold uppercase tracking-wider text-gray-500">{product.brand}</span>
              ) : (
                <span className="font-semibold uppercase tracking-wider text-gray-400">LUCANA</span>
              )}
              {product.sub_category && (
                <span className="bg-gray-100 px-2 py-0.5 rounded-none text-[11px] text-gray-600">{product.sub_category}</span>
              )}
            </div>
            
            <Link
              to={`/product/${product.slug}`}
              className="block font-sans font-bold text-lg text-gray-900 hover:text-[#C62828] transition-colors duration-150 line-clamp-1"
            >
              {product.name}
            </Link>

            {/* Rating */}
            <div className="flex items-center space-x-1.5 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-semibold text-gray-700">{rating}</span>
              <span className="text-xs text-gray-400">({reviewsCount} reviews)</span>
            </div>

            <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-gray-900">${activePrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">${price.toFixed(2)}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Link
                to={`/product/${product.slug}`}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-none transition-colors duration-150 flex items-center space-x-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                id={`add-btn-list-${product.id}`}
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
                className={`p-2 bg-gray-900 text-white rounded-none hover:bg-[#C62828] transition-colors duration-200 ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300' : ''
                }`}
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div
      id={`product-card-grid-${product.id}`}
      className="group flex flex-col h-full bg-white rounded-none border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden flex items-center justify-center">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Floating Badges */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#C62828] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-none uppercase tracking-widest">
            Sale
          </span>
        )}
        
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-none uppercase tracking-widest">
            Only {product.stock} Left
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm font-bold text-gray-500 uppercase tracking-widest">
            Out of Stock
          </span>
        )}

        {/* Quick Add To Cart Button on Hover */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <button
            id={`add-btn-grid-hover-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`w-full py-2.5 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-none shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300' : ''
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {product.brand ? (
              <span>{product.brand}</span>
            ) : (
              <span>LUCANA</span>
            )}
            {product.sub_category && (
              <span className="bg-gray-50 px-2 py-0.5 rounded-none text-gray-500">{product.sub_category}</span>
            )}
          </div>
          
          <Link
            to={`/product/${product.slug}`}
            className="block font-sans font-bold text-sm text-gray-900 hover:text-[#C62828] transition-colors duration-150 line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[11px] font-bold text-gray-600">{rating}</span>
            <span className="text-[11px] text-gray-400">({reviewsCount})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          {/* Price */}
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm sm:text-base font-extrabold text-gray-950">${activePrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">${price.toFixed(2)}</span>
            )}
          </div>

          {/* Mobile direct add-to-cart button */}
          <button
            id={`add-btn-grid-mobile-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`p-2 bg-gray-100 hover:bg-[#C62828] hover:text-white rounded-none text-gray-700 transition-all duration-200 sm:hidden ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed text-gray-300 hover:bg-gray-100' : ''
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
