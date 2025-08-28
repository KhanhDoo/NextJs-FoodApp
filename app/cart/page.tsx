// app/cart/page.tsx
"use client";
import { useCart } from "@/app/providers";
import { apiFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const placeOrder = async () => {
    try {
      setMsg(null);
      setLoading(true);
      const payload = {
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
      };
      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setMsg(data.message || "Đặt hàng thất bại");
      clearCart();
      setMsg("Đặt hàng thành công!");
      router.push("/orders");
    } catch (e: unknown) {
      console.error("Lỗi đặt hàng:", e);
      setLoading(false);
      setMsg("Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      {items.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.productId}
              className="flex items-center justify-between bg-white rounded-xl p-3 shadow"
            >
              <div className="flex items-center gap-3">
                {it.imageUrl && (
                  <Image
                    src={it.imageUrl}
                    width={16}
                    height={16}
                    className=" object-cover rounded-lg"
                    alt=""
                  />
                )}
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-gray-500">
                    {it.price.toLocaleString()} đ
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  className="w-20 border rounded p-2"
                  value={it.quantity}
                  onChange={(e) =>
                    updateQty(it.productId, Math.max(1, Number(e.target.value)))
                  }
                />
                <button
                  className="text-red-600"
                  onClick={() => removeItem(it.productId)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl">
            Tổng: {totalPrice.toLocaleString()} đ
          </div>
          <button
            disabled={loading}
            onClick={placeOrder}
            className="w-full bg-black text-white rounded-lg py-3"
          >
            {loading ? "Đang đặt hàng..." : "Đặt hàng"}
          </button>
          {msg && <p className="text-center mt-2">{msg}</p>}
        </div>
      )}
    </div>
  );
}
