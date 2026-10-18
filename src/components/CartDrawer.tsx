import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { formatPrice, getActivePrice, getMainImage, getShippingLabel } from '../utils/productUtils';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount
  } = useShop();

  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close drawer on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCartOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setCartOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, setCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Drawer */}
      <div
        ref={drawerRef}
        id="cart-drawer-panel"
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slideLeft overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h3 className="font-sans font-bold text-lg text-gray-900">Your Fishing Bag</h3>
            <span className="bg-[#C62828] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div id="cart-empty-state" className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-bold text-gray-900 text-base">Your tackle bag is empty</p>
              <p className="text-sm text-gray-400 mt-1 max-w-[260px] mx-auto">
                Explore our collections of reels, rods, and lures to gear up for your next trip.
              </p>
              <button
                id="cart-empty-shop-now"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/shop');
                }}
                className="mt-6 px-6 py-2.5 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-lg transition-colors duration-200"
              >
                BROWSE ALL SHOP
              </button>
            </div>
          ) : (
            cart.map(item => {
              const activePrice = getActivePrice(item.product);
              const colorVariant = item.product.color_variants?.find(variant => variant.name === item.selectedColor);
              const itemImage = getMainImage({
                images: colorVariant?.images.length ? colorVariant.images : item.product.images,
              });
              const itemKey = `${item.product.id}-${(item.selectedColor ?? 'default').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return (
                <div key={itemKey} id={`cart-item-${itemKey}`} className="py-5 flex space-x-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={itemImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="font-bold text-sm text-gray-900 hover:text-[#C62828] transition-colors duration-150 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          id={`remove-cart-item-${itemKey}`}
                          onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                          className="p-1 text-gray-400 hover:text-[#C62828] rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{item.product.brand}</p>
                      {item.selectedColor && (
                        <p className="text-[10px] text-gray-500 mt-1">Color: {item.selectedColor}</p>
                      )}
                      
                      {item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {Object.entries(item.selectedSpecs).map(([key, value]) => (
                            <span key={key} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                        <button
                          id={`dec-qty-${itemKey}`}
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          id={`inc-qty-${itemKey}`}
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                          className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-extrabold text-gray-950">
                        {formatPrice(activePrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Subtotal & Action */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {getShippingLabel(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Taxes and additional duties calculated at checkout. Free shipping automatically applied!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                id="cart-checkout-btn"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
                <span>ORDER VIA WHATSAPP</span>
              </button>
              
              <button
                id="cart-continue-browsing"
                onClick={() => setCartOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 text-center transition-colors duration-150"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
