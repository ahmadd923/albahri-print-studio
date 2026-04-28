import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string; // local uuid
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  size?: string;
  color?: string;
  printing_details?: string;
  design_url?: string;
  image_url?: string;
};

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<CartItem>) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | undefined>(undefined);
const KEY = "albahri_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = (item) =>
    setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
  const remove: CartCtx["remove"] = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const update: CartCtx["update"] = (id, patch) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <Ctx.Provider value={{ items, add, remove, update, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}