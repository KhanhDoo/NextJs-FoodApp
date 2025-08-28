// app/products/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/app/providers";
import Image from "next/image";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
      const data = await res.json();
      setP(data.product);
    })();
  }, [id]);

  if (!p) return <p>Đang tải…</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex gap-6">
        <Image
          src={p.imageUrl}
          alt={p.name}
          width={72}
          height={72}
          className=" object-cover rounded-xl"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="text-gray-600 my-2">{p.description}</p>
          <div className="font-bold text-xl mb-3">
            {p.price.toLocaleString()} đ
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              className="w-20 border rounded p-2"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            />
            <button
              className="bg-black text-white rounded-lg px-4 py-2"
              onClick={() =>
                addItem(
                  {
                    productId: p._id,
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                  },
                  qty,
                )
              }
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
