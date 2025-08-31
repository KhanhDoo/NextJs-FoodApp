"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Order = {
  _id: string;
  user: { name: string; email: string };
  items: { product: { name: string }; quantity: number; price: number }[];
  total: number;
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    apiFetch("/api/orders/admin")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    await apiFetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setOrders((orders) =>
      orders.map((o) => (o._id === id ? { ...o, status } : o)),
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Khách</th>
            <th>Món</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>
                {o.user.name} <br /> {o.user.email}
              </td>
              <td>
                {o.items.map((i) => (
                  <div key={i.product.name}>
                    {i.product.name} x{i.quantity}
                  </div>
                ))}
              </td>
              <td>{o.total.toLocaleString()} đ</td>
              <td>{o.status}</td>
              <td>
                {o.status !== "completed" && o.status !== "cancelled" && (
                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o._id, e.target.value as Order["status"])
                    }
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="delivering">Đang giao</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Hủy</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
