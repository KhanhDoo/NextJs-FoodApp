// app/providers.tsx
"use client";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQty: (productId: string, qty: number) => void;
  totalPrice: number;
  totalQty: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem: CartCtx["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.productId === item.productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((x) => x.productId !== productId));

  const clearCart = () => setItems([]);

  const updateQty = (productId: string, qty: number) =>
    setItems((prev) =>
      prev.map((x) =>
        x.productId === productId ? { ...x, quantity: Math.max(1, qty) } : x,
      ),
    );

  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items],
  );
  const totalQty = useMemo(
    () => items.reduce((s, it) => s + it.quantity, 0),
    [items],
  );

  const value: CartCtx = {
    items,
    addItem,
    removeItem,
    clearCart,
    updateQty,
    totalPrice,
    totalQty,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
