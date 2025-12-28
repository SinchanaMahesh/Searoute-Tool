declare global {
  interface Window {
    L: any;
  }
}

// Fallback declaration for searoute-js (no published types)
declare module "searoute-js";

export {};
