"use client";

import { useState, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Check } from "lucide-react";

interface Props {
  id: string;
  title: string;
  category: string;
  price: number;
}

export default function AddToCartButton({ id, title, category, price }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    addItem({ id, title, category, price, image: null });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, id, title, category, price]);

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-medium transition-all duration-200 ${
        added
          ? "bg-green-600 text-white"
          : "bg-[var(--gold)] text-black hover:bg-[var(--gold-light)]"
      }`}
    >
      {added ? (
        <>
          <Check size={14} /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart size={14} /> Add to Cart
        </>
      )}
    </button>
  );
}
