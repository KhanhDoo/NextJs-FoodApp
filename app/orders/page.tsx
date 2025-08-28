"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type OrderItem = {
  productId: {
    _id: string;
    name: string;
  } | null;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
  items: OrderItem[];
  totalPrice: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Đang tải…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between">
              <div>
                <span className="font-semibold">Mã:</span>{" "}
                {o._id.slice(-6).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span> {o.status}
              </div>
            </div>
            <ul className="mt-2 list-disc pl-5">
              {o.items.map((it, idx) => (
                <li key={idx}>
                  {it.productId?.name || "Sản phẩm"} × {it.quantity} —{" "}
                  {it.price.toLocaleString()} đ
                </li>
              ))}
            </ul>
            <div className="text-right font-bold mt-2">
              Tổng: {o.totalPrice.toLocaleString()} đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
