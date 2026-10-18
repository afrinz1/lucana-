import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Specification } from '../types';
import {
  getActivePrice,
  getBasePrice,
  getMainImage,
  getProductBySlug,
  getRelatedProducts,
  getReviewsCount,
  getSavings,
  getSimulatedRating,
  getBrandSlugForProduct,
  hasDiscount,
  isOutOfStock,
  formatPrice,
  categories,
} from '../utils/productUtils';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEO } from '../components/SEO';
import { SITE_URL } from '../utils/siteConfig';

const CONFIGURABLE_SPEC_KEYWORDS = ['hand', 'size', 'strength', 'length'];

/** Specs that can be configured on the product page (e.g. Hand / Size / Strength). */
const isConfigurableSpec = (spec?: Specification): spec is Specification =>
  !!spec && !!spec.title && CONFIGURABLE_SPEC_KEYWORDS.some(k => spec.title.toLowerCase().includes(k));

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useShop();

  const product = slug ? getProductBySlug(slug) : undefined;

  // 1. Interactive States
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specifications' | 'capacity'>('features');

  // Synchronize first image and reset states when slug changes
  useEffect(() => {
    if (product) {
      const firstColor = product.color_variants?.[0];
      setSelectedColor(firstColor?.name ?? '');
      setActiveImage(getMainImage({
        images: firstColor?.images.length ? firstColor.images : product.images,
      }));
      setQuantity(1);
      setIsZoomOpen(false);
      setImageZoom(1);
      
      // Auto-populate default specifications selection (e.g. Hand Retrieve or Size)
      const defaults: Record<string, string> = {};
      const specs = product.specifications || [];
      const retrieveSpec = specs.find(s => s && s.title && (s.title.toLowerCase().includes('retrieve') || s.title.toLowerCase().includes('size')));
      if (retrieveSpec) {
        defaults[retrieveSpec.title] = retrieveSpec.value;
      }
      setSelectedSpecs(defaults);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center py-20 bg-gray-50 pt-28">
        <h2 className="text-xl font-bold text-gray-900">Fishing Product Not Found</h2>
        <p className="text-sm text-gray-400 mt-1 max-w-sm">
          The requested tackle code or slug doesn't exist in our systems. It may have been retired or sold out.
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

  const basePrice = getBasePrice(product);
  const activePrice = getActivePrice(product);
  const discounted = hasDiscount(product);
  const colorVariants = product.color_variants ?? [];
  const activeColorVariant = colorVariants.find(variant => variant.name === selectedColor) ?? colorVariants[0];
  const availableStock = activeColorVariant?.stock ?? product.stock;
  const outOfStock = isOutOfStock({ stock: availableStock });
  const productImages = activeColorVariant?.images.length ? activeColorVariant.images : product.images;
  const related = getRelatedProducts(product, 4);
  const rating = getSimulatedRating(product);
  const reviewsCount = getReviewsCount(product);
  const configurableSpecs = (product.specifications || []).filter(isConfigurableSpec);
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;
  const brandSlug = getBrandSlugForProduct(product);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSpecs, activeColorVariant?.name);
  };

  const handleColorSelect = (color: string) => {
    const variant = colorVariants.find(option => option.name === color);
    setSelectedColor(color);
    setActiveImage(getMainImage({
      images: variant?.images.length ? variant.images : product.images,
    }));
    setIsZoomOpen(false);
  };

  const handleSpecSelect = (title: string, value: string) => {
    setSelectedSpecs(prev => ({ ...prev, [title]: value }));
  };

  // JSON-LD structured data: Product schema for rich search results
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: productImages.length > 0 ? productImages : [getMainImage(product)],
    description: product.description,
    sku: product.sku,
    url: `${SITE_URL}/product/${product.slug}`,
    brand: { '@type': 'Brand', name: product.brand || 'Lucana' },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: getActivePrice(product).toFixed(2),
      availability: isOutOfStock(product)
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div id="product-detail-page" className="bg-[#FAF9F9] min-h-screen pt-24 pb-20">
      <SEO 
        title={`${product.name} | Premium Fishing Gear | Lucana`}
        description={product.description}
        keywords={`${product.name}, ${product.category}, ${product.brand || 'lucana'}, saltwater fishing`}
        ogImage={activeImage || productImages[0]}
        structuredData={[productSchema]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          className="py-4"
          items={[
            { name: 'Home', to: '/' },
            { name: 'Shop', to: '/shop' },
            { name: categoryName, to: `/category/${product.category}` },
            { name: product.name },
          ]}
        />

        {/* Product Visual & Buy Panel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-4 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          
          {/* A. Image Showcase (Col-Span 6) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main view container */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center cursor-zoom-in"
                referrerPolicy="no-referrer"
                onClick={() => {
                  setImageZoom(1);
                  setIsZoomOpen(true);
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setImageZoom(1);
                  setIsZoomOpen(true);
                }}
                aria-label={`Zoom in on ${product.name}`}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-gray-900 shadow-md flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              {discounted && (
                <span className="absolute top-4 left-4 bg-[#C62828] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  SAVE ₹{getSavings(product).toFixed(0)}
                </span>
              )}
            </div>

            {isZoomOpen && (
              <div
                className="fixed inset-0 z-100 bg-gray-950/90 p-4 sm:p-8 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
                aria-label={`${product.name} enlarged image`}
                onClick={() => setIsZoomOpen(false)}
                onWheel={event => {
                  event.preventDefault();
                  setImageZoom(current => Math.min(3, Math.max(1, current + (event.deltaY < 0 ? 0.25 : -0.25))));
                }}
              >
                <div
                  className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 rounded-full bg-white/95 p-1 shadow-lg"
                  onClick={event => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setImageZoom(current => Math.min(3, current + 0.25))}
                    aria-label="Zoom in"
                    className="w-10 h-10 rounded-full text-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="min-w-12 text-center text-xs font-bold text-gray-700">{Math.round(imageZoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setImageZoom(current => Math.max(1, current - 0.25))}
                    aria-label="Zoom out"
                    className="w-10 h-10 rounded-full text-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageZoom(1)}
                    aria-label="Reset image zoom"
                    className="w-10 h-10 rounded-full text-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  aria-label="Close enlarged image"
                  className="absolute top-4 right-4 sm:top-8 sm:right-8 w-11 h-11 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={activeImage}
                  alt={`${product.name} enlarged`}
                  className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
                  style={{ transform: `scale(${imageZoom})` }}
                  referrerPolicy="no-referrer"
                  onClick={event => event.stopPropagation()}
                />
              </div>
            )}

            {/* Alternating Thumbnail selector */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-gray-900 scale-95 shadow-sm' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} — product image ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* B. Product Buy Settings (Col-Span 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Header Title Information */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center text-xs text-gray-400 font-bold uppercase">
                <span className="text-[#C62828] hover:underline">
                  <Link to={`/category/${product.category}`}>{categoryName}</Link>
                </span>
                <span>&bull;</span>
                <span className="text-gray-500">
                  {brandSlug ? (
                    <Link to={`/brand/${brandSlug}`} className="hover:text-gray-900 hover:underline transition-colors">
                      {product.brand} Partner Series
                    </Link>
                  ) : (
                    <span>{product.brand} Partner Series</span>
                  )}
                </span>
              </div>
              
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center space-x-2 pt-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(parseFloat(rating)) ? 'fill-current' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-800">{rating} Out Of 5.0</span>
                <span className="text-xs text-gray-400">({reviewsCount} tournament reports)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="py-4 px-5 bg-gray-50/70 rounded-2xl flex items-baseline justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs text-gray-400 font-bold uppercase">Tackle Price</span>
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                    {formatPrice(activePrice)}
                  </span>
                  {discounted && (
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(basePrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status Box */}
              <div className="text-right">
                <span className="text-xs text-gray-400 font-bold uppercase block mb-1">In Stock Status</span>
                {outOfStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                    Sold Out
                  </span>
                ) : typeof availableStock === 'number' && availableStock <= 5 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 animate-pulse">
                    Critical Stock ({availableStock} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
                    Active (Ready to ship)
                  </span>
                )}
              </div>
            </div>

            {/* Description Summary */}
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {product.description}
            </p>

            {colorVariants.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                  Color: <span className="text-gray-500">{activeColorVariant?.name}</span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {colorVariants.map(variant => (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => handleColorSelect(variant.name)}
                      aria-label={`Select ${variant.name} color`}
                      aria-pressed={activeColorVariant?.name === variant.name}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        activeColorVariant?.name === variant.name
                          ? 'border-gray-900 bg-gray-50 text-gray-950 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 rounded-full border border-black/10"
                        style={{ background: `linear-gradient(135deg, #111 50%, ${variant.swatch} 50%)` }}
                      />
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom specification choices */}
            {configurableSpecs.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                  Configure Options:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {configurableSpecs.map(spec => (
                      <div key={spec.title} className="flex flex-col space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">{spec.title}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSpecSelect(spec.title, spec.value)}
                            className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                              selectedSpecs[spec.title] === spec.value
                                ? 'bg-gray-900 text-white border-transparent shadow-sm'
                                : 'border-gray-200 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {spec.value}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity Selector and CTA Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3.5">
                
                {/* Quantity Box */}
                {!outOfStock && (
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1 self-start sm:self-auto">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev =>
                        typeof availableStock === 'number'
                          ? Math.min(availableStock, prev + 1)
                          : prev + 1
                      )}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Primary CTA Add button */}
                <button
                  id="pdp-add-to-cart-btn"
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 bg-gray-950 hover:bg-[#C62828] text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2.5 ${
                    outOfStock ? 'bg-gray-200 cursor-not-allowed hover:bg-gray-200 text-gray-400' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{outOfStock ? 'TACKLE OUT OF STOCK' : 'ADD TO FISHING BAG'}</span>
                </button>
              </div>

              {/* Utility details */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 font-semibold">
                <span>SKU Code: {product.sku}</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`hover:text-[#C62828] flex items-center space-x-1 transition-colors ${isWishlisted ? 'text-[#C62828]' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Details & Specs Tabs Section */}
        <section id="pdp-additional-info" className="mt-12 bg-white rounded-3xl p-5 sm:p-10 border border-gray-100 shadow-sm space-y-6 sm:space-y-8">
          
          {/* Tab buttons */}
          <div className="overflow-x-auto scrollbar-none border-b border-gray-100 -mx-5 px-5 sm:mx-0 sm:px-0">
            <div className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 min-w-max pb-px">
              <button
                onClick={() => setActiveTab('features')}
                className={`pb-4 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'features' ? 'border-[#C62828] text-gray-900 font-extrabold' : 'border-transparent hover:text-gray-600'
                }`}
              >
                Key Features
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-4 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'specifications' ? 'border-[#C62828] text-gray-900 font-extrabold' : 'border-transparent hover:text-gray-600'
                }`}
              >
                Specifications Table
              </button>
              {product.category === 'reels' && (
                <button
                  onClick={() => setActiveTab('capacity')}
                  className={`pb-4 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'capacity' ? 'border-[#C62828] text-gray-900 font-extrabold' : 'border-transparent hover:text-gray-600'
                  }`}
                >
                  Line Capacity (Reels)
                </button>
              )}
            </div>
          </div>

          {/* A. Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-sans font-bold text-gray-900 text-sm sm:text-base uppercase tracking-wider">Engineered Performance Characteristics</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <span className="w-1.5 h-1.5 bg-[#C62828] rounded-full mt-2 shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 font-normal italic">Key features will be populated soon.</p>
                )}
              </ul>
            </div>
          )}

          {/* B. Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="animate-fadeIn max-w-2xl border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, i) => spec && (
                  <div key={i} className="flex flex-col sm:flex-row py-3 sm:py-4 px-4 sm:px-6 hover:bg-gray-50/50 transition-colors gap-1 sm:gap-4">
                    <span className="font-bold text-gray-400 sm:text-gray-500 w-full sm:w-1/3 uppercase text-[10px] sm:text-xs tracking-wider shrink-0">
                      {spec.title}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-950">
                      {spec.value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="p-6 text-gray-400 font-normal italic text-xs sm:text-sm">Specifications to be updated.</p>
              )}
            </div>
          )}

          {/* C. Line Capacity Tab (Only Reels) */}
          {activeTab === 'capacity' && product.category === 'reels' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 animate-fadeIn">
              {/* Nylon */}
              <div className="space-y-3.5 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
                <h4 className="font-sans font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Nylon / Monofilament Capacity</h4>
                <div className="space-y-2">
                  {product.line_capacity && product.line_capacity.nylon && product.line_capacity.nylon.length > 0 ? (
                    product.line_capacity.nylon.map((cap, i) => (
                      <div key={i} className="flex justify-between text-[11px] sm:text-xs py-2 border-b border-gray-200/50 font-semibold text-gray-600">
                        <span>Line Weight Gauge</span>
                        <span className="text-gray-950 font-bold">{cap}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 font-normal italic text-xs py-2">Mono capacity specifications pending.</p>
                  )}
                </div>
              </div>

              {/* Braid */}
              <div className="space-y-3.5 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
                <h4 className="font-sans font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Braided Line Capacity</h4>
                <div className="space-y-2">
                  {product.line_capacity && product.line_capacity.braid && product.line_capacity.braid.length > 0 ? (
                    product.line_capacity.braid.map((cap, i) => (
                      <div key={i} className="flex justify-between text-[11px] sm:text-xs py-2 border-b border-gray-200/50 font-semibold text-gray-600">
                        <span>Braid Strength Gauge</span>
                        <span className="text-gray-950 font-bold">{cap}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 font-normal italic text-xs py-2">Braided capacity specifications pending.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Related Products list */}
        {related.length > 0 && (
          <section id="related-products-section" className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-gray-950">
                Related Rigging Options
              </h2>
              <Link
                to={`/category/${product.category}`}
                className="text-xs font-bold text-[#C62828] hover:underline uppercase tracking-wider"
              >
                Browse all {categoryName.toLowerCase()}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {related.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};