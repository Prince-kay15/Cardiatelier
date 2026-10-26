import { useSyncExternalStore } from "react";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  image: string | null;
  productType: string;
};

const STORAGE_KEY = "cardiatelier-cart";
const listeners = new Set<() => void>();

// Cached snapshot: useSyncExternalStore requires getSnapshot to return a
// stable reference between renders, otherwise React re-renders forever.
let snapshot: CartItem[] = [];
let initialized = false;

function parseCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function refreshSnapshot() {
  const next = parseCart();
  // Only swap references when the contents actually change so renders settle.
  if (JSON.stringify(next) !== JSON.stringify(snapshot)) snapshot = next;
  initialized = true;
}

function writeCart(items: CartItem[]) {
  snapshot = items;
  initialized = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

export function getCartSnapshot(): CartItem[] {
  if (!initialized) refreshSnapshot();
  return snapshot;
}

export function subscribeToCart(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribeToCart, getCartSnapshot, () => []);
}

export function itemKey(productId: string, size: string | null, color: string | null) {
  return [productId, size ?? "", color ?? ""].join("|");
}

export function addToCart(item: Omit<CartItem, "key">) {
  const items = readCart();
  const key = itemKey(item.productId, item.size, item.color);
  const existing = items.find((i) => i.key === key);
  if (existing) {
    writeCart(
      items.map((i) =>
        i.key === key ? { ...i, quantity: Math.min(i.quantity + item.quantity, 20) } : i,
      ),
    );
  } else {
    writeCart([...items, { ...item, key }]);
  }
}

export function updateQuantity(key: string, quantity: number) {
  const items = readCart();
  if (quantity <= 0) {
    writeCart(items.filter((i) => i.key !== key));
  } else {
    writeCart(items.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, 20) } : i)));
  }
}

export function removeFromCart(key: string) {
  writeCart(readCart().filter((i) => i.key !== key));
}

export function clearCart() {
  writeCart([]);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity * i.price, 0);
}
