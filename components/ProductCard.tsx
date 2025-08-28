// components/ProductCard.tsx
"use client";
import { useCart } from "@/app/providers";
import Product from "@/models/Product";
import Image from "next/image";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default function ProductCard({ p }: { p: Product }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <Image
        src={p.imageUrl}
        alt={p.name}
        width={400} // bắt buộc có width
        height={300} // bắt buộc có height
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="font-semibold">{p.name}</div>
      <div className="text-sm text-gray-500 line-clamp-2">{p.description}</div>
      <div className="mt-2 font-bold">{p.price.toLocaleString()} đ</div>
      <div className="mt-auto flex gap-2">
        <a
          href={`/products/${p._id}`}
          className="flex-1 text-center border rounded-lg py-2 hover:bg-gray-50"
        >
          Chi tiết
        </a>
        <button
          className="flex-1 bg-black text-white rounded-lg py-2"
          onClick={() =>
            addItem(
              {
                productId: p._id,
                name: p.name,
                price: p.price,
                imageUrl: p.imageUrl,
              },
              1,
            )
          }
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
