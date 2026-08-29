"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./types";

export interface CompareItem {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  brand: string;
  category: string;
  price: number;
  regularPrice?: number;
  rating?: number;
  keySpec?: string;
  specs?: { label: string; value: string }[];
  warranty?: string;
  stock: number;
}

interface CompareContextValue {
  items: CompareItem[];
  count: number;
  isComparing: (productId: string) => boolean;
  toggle: (product: Product) => { ok: boolean; reason?: string };
  remove: (productId: string) => void;
  clear: () => void;
  isLoaded: boolean;
}

const MAX_COMPARE = 4;
const CompareContext = createContext<CompareContextValue | undefined>(undefined);
const STORAGE_KEY = "ipf.compare.v1";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupt/unavailable storage — start empty.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full/unavailable — compare still works for this tab session.
    }
  }, [items, isLoaded]);

  const isComparing = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const toggle = useCallback(
    (product: Product): { ok: boolean; reason?: string } => {
      let result: { ok: boolean; reason?: string } = { ok: true };
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === product.id);
        if (exists) return prev.filter((i) => i.productId !== product.id);

        if (prev.length >= MAX_COMPARE) {
          result = { ok: false, reason: `You can compare up to ${MAX_COMPARE} products at a time.` };
          return prev;
        }
        if (prev.length > 0 && prev[0].category !== product.category) {
          result = { ok: false, reason: "You can only compare products from the same category." };
          return prev;
        }

        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            brand: product.brand,
            category: product.category,
            price: product.price,
            regularPrice: product.regularPrice,
            rating: product.rating,
            keySpec: product.keySpec,
            specs: product.specs,
            warranty: product.warranty,
            stock: product.stock,
          },
        ];
      });
      return result;
    },
    [],
  );

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.length, [items]);

  const value: CompareContextValue = { items, count, isComparing, toggle, remove, clear, isLoaded };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
