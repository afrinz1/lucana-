/// <reference types="vite/client" />

declare module "*.webm" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  /** The target phone number (with country code) for receiving WhatsApp orders. */
  readonly VITE_WHATSAPP_PHONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}