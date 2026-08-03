import { CartItem, OrderDetails } from '../types';
import { formatPrice, getActivePrice } from './productUtils';

const DEFAULT_WHATSAPP_PHONE = '+1234567890';

/** Digits-only target phone number from env (falls back to the example). */
function getTargetPhone(): string {
  const raw = import.meta.env.VITE_WHATSAPP_PHONE || DEFAULT_WHATSAPP_PHONE;
  return raw.replace(/\D/g, '');
}

/** Build a wa.me deep link with an encoded message. */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${getTargetPhone()}?text=${encodeURIComponent(message)}`;
}

interface OrderMessageOptions {
  orderId: string;
  details: OrderDetails;
  cart: CartItem[];
  subtotal: number;
  shipping: number;
}

/** Compose the full WhatsApp order message for a checkout. */
export function generateOrderMessage({ orderId, details, cart, subtotal, shipping }: OrderMessageOptions): string {
  const grandTotal = subtotal + shipping;

  let message = `🎣 *LUCANA TACKLE ORDER* 🎣\n`;
  message += `---------------------------\n`;
  message += `Order ID: *${orderId}*\n\n`;

  message += `👤 *Customer Details:*\n`;
  message += `- Name: ${details.fullName}\n`;
  message += `- Email: ${details.email || 'N/A'}\n`;
  message += `- Phone: ${details.phone || 'N/A'}\n\n`;

  message += `📍 *Shipping Address:*\n`;
  message += `- Address: ${details.address}\n`;
  message += `- City: ${details.city}\n`;
  message += `- Zip Code: ${details.zipCode}\n`;
  message += `- Country: ${details.country}\n`;
  if (details.deliveryNotes) {
    message += `\n📝 *Delivery Notes:*\n- ${details.deliveryNotes}\n`;
  }

  message += `\n🛒 *Items Ordered:*\n`;
  cart.forEach(item => {
    const price = getActivePrice(item.product);
    message += `- *${item.quantity}x ${item.product.name}*\n`;
    message += `  Brand: ${item.product.brand}\n`;
    if (item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0) {
      const specsStr = Object.entries(item.selectedSpecs)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      message += `  Specs: [${specsStr}]\n`;
    }
    message += `  Price: ${formatPrice(price)} each (${formatPrice(price * item.quantity)})\n`;
  });

  message += `\n---------------------------\n`;
  message += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  message += `*Shipping:* ${shipping === 0 ? 'FREE EXPRESS' : formatPrice(shipping)}\n`;
  message += `*Grand Total:* *${formatPrice(grandTotal)}*\n\n`;
  message += `Please confirm my order and send payment details. Thank you!`;

  return message;
}
