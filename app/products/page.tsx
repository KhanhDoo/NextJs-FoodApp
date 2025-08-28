// app/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Đang tải…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
    </div>
  );
}
