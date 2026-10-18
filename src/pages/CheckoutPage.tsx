import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, ArrowLeft, Copy, Check, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatPrice, getActivePrice, getMainImage, getShippingCost } from '../utils/productUtils';
import { generateOrderMessage, getWhatsAppUrl } from '../utils/whatsapp';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, checkoutSuccess, setCheckoutSuccess } = useShop();
  const navigate = useNavigate();

  // 1. Order details state
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    deliveryNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  // Handle inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const activeShipping = getShippingCost(cartSubtotal);
  const grandTotal = cartSubtotal + activeShipping;

  // Handle checkout form submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate standard order identifier
    const generatedId = `LUC-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullMsg = generateOrderMessage({
      orderId: generatedId,
      details: formData,
      cart,
      subtotal: cartSubtotal,
      shipping: activeShipping,
    });
    
    setOrderId(generatedId);
    setWhatsappMessage(fullMsg);

    // Open WhatsApp in new tab automatically
    const whatsappUrl = getWhatsAppUrl(fullMsg);
    
    // Simulate short processing
    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutSuccess(true);
      window.open(whatsappUrl, '_blank');
      clearCart();
    }, 1200);
  };

  // Reset checkout state when unmounting
  useEffect(() => {
    return () => {
      setCheckoutSuccess(false);
    };
  }, [setCheckoutSuccess]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Success Screen if order complete
  if (checkoutSuccess) {
    const waUrl = getWhatsAppUrl(whatsappMessage);
    return (
      <div id="checkout-success-screen" className="bg-[#FAF9F9] min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-pulse">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
              WhatsApp Order Prepared
            </span>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950">
              Your Order is Ready to Send!
            </h1>
            <p className="text-sm text-gray-400 font-semibold font-mono">
              Order ID: {orderId}
            </p>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto font-medium">
            We've compiled your high-performance tackle order into a WhatsApp message. A browser window was launched to send it. If it didn't open or you closed it, click the button below to start chatting with us.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2 uppercase cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Send via WhatsApp</span>
            </a>
            
            <button
              onClick={handleCopyMessage}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 uppercase cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Message!' : 'Copy Order Text'}</span>
            </button>
          </div>

          {/* Message Preview */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-left">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Message Preview:</h4>
            <pre className="p-4 bg-gray-50 rounded-2xl text-[11px] font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap max-h-[220px]">
              {whatsappMessage}
            </pre>
          </div>

          <div className="pt-6 border-t border-gray-100 py-4 text-[10px] text-gray-400 font-bold flex justify-between uppercase">
            <span>Our Team Response: Under 15 Mins</span>
            <span>Est. Arrival: 2-3 Business Days</span>
          </div>

          <div className="pt-4 grid grid-cols-1 gap-2">
            <button
              onClick={() => navigate('/shop')}
              className="w-full py-3.5 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-xl shadow-md transition-colors uppercase"
            >
              Continue Tackle Shopping
            </button>
            <Link
              to="/"
              className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase"
            >
              Back to Home page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if trying to check out with empty cart
  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9F9] min-h-screen pt-24 pb-20 flex items-center justify-center text-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-5">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your Fishing Bag is Empty</h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto font-medium">
            You must add tackle products to your shopping bag before you can proceed to the checkout terminal.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full py-3 bg-gray-900 hover:bg-[#C62828] text-white text-xs font-bold rounded-lg transition-colors uppercase"
          >
            Go Rig up some Tackle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page" className="bg-[#FAF9F9] min-h-screen pt-24 pb-20">
      <SEO 
        title="Secure Checkout | Lucana"
        description="Review your premium fishing tackle bag and proceed to fast, direct WhatsApp checkout with the Lucana logistics desk."
        robots="noindex, nofollow"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <Breadcrumbs
          className="py-4"
          items={[
            { name: 'Home', to: '/' },
            { name: 'Shop', to: '/shop' },
            { name: 'WhatsApp Checkout' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 items-start">
          
          {/* A. Shipping Form Panel (Col-span 7) */}
          <form
            onSubmit={handleCheckoutSubmit}
            className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8"
          >
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-gray-950 leading-tight">
                    WhatsApp Order Checkout
                  </h2>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
                    Fast & Secure direct purchase
                  </p>
                </div>
              </div>
            </div>

            {/* Explanatory Info Banner */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 sm:p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                ?
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-gray-950">How Direct WhatsApp Ordering Works</p>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Fill in your delivery address and details. When you click <strong className="text-emerald-700 font-extrabold">Send Order via WhatsApp</strong>, we'll format your tackle items into an elegant text message and direct you to WhatsApp to send it. Our agents will process, collect payment details, and confirm shipment directly inside the chat!
                </p>
              </div>
            </div>

            {/* 1. Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                1. Customer & Contact
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. David Captain"
                    className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold">Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="david@anglerteam.com"
                  className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>
            </div>

            {/* 2. Delivery Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                2. Shipping Destination
              </h3>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold">Street Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 100 Marina Pier Blvd"
                  className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Seattle"
                    className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Zip Code *</label>
                  <input
                    type="text"
                    required
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="98101"
                    className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white"
                  >
                    <option>United States</option>
                    <option>Japan</option>
                    <option>Australia</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold">Delivery / Order Notes (Optional)</label>
                <textarea
                  name="deliveryNotes"
                  value={formData.deliveryNotes || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g. Please pack safely, or instructions regarding specific shipping demands..."
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-gray-900 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/shop"
                className="text-xs font-bold text-gray-400 hover:text-gray-950 flex items-center space-x-1 uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shop</span>
              </Link>
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className={`px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center space-x-2.5 cursor-pointer ${
                  isSubmitting ? 'bg-emerald-300 cursor-wait hover:bg-emerald-300 text-emerald-100' : ''
                }`}
              >
                {isSubmitting ? (
                  <span>PREPARING FOR WHATSAPP...</span>
                ) : (
                  <>
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>SEND ORDER VIA WHATSAPP ({formatPrice(grandTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* B. Order Summary Sidebar (Col-span 5) */}
          <aside className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-sans font-bold text-gray-950 text-base">Your Cart Items</h3>
            
            {/* Items scroll area */}
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[300px] pr-2">
              {cart.map(item => {
                const price = getActivePrice(item.product);
                const colorVariant = item.product.color_variants?.find(variant => variant.name === item.selectedColor);
                const itemImage = getMainImage({
                  images: colorVariant?.images.length ? colorVariant.images : item.product.images,
                });
                return (
                  <div key={`${item.product.id}-${item.selectedColor ?? ''}`} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-md overflow-hidden shrink-0">
                        <img src={itemImage} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                          {item.product.brand} &bull; Qty {item.quantity}
                        </p>
                        {item.selectedColor && (
                          <p className="text-[10px] text-gray-500 mt-1">Color: {item.selectedColor}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 shrink-0">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations block */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-500 font-semibold">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-950 font-bold">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Packing & Air Shipping</span>
                <span className="text-gray-950 font-bold">
                  {activeShipping === 0 ? 'FREE' : formatPrice(activeShipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-950 font-extrabold pt-2.5 border-t border-gray-100">
                <span>Total Order Value</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Trust disclaimer */}
            <div className="bg-gray-50/70 rounded-2xl p-4 flex items-start space-x-3 text-[10px] text-gray-400 font-semibold leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700 font-bold">Secure No-Card Checkout</p>
                <p className="mt-0.5">We never request or store sensitive banking or card numbers. Your checkout order is safely completed in one-on-one encrypted chat.</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
