// app/admin/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
};

export default function AdminProducts() {
  const [me, setMe] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });
  const [msg, setMsg] = useState<string | null>(null);

  const loadMe = async () => {
    const res = await apiFetch("/api/users/me");
    const data = await res.json();
    if (res.ok) setMe(data.user);
    else setMe(null);
  };

  const loadProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    (async () => {
      await loadMe();
      await loadProducts();
    })();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const payload = { ...form, price: Number(form.price) };
    const res = await apiFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message || "Không thể tạo");
    setMsg("Tạo sản phẩm thành công");
    setForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
    });
    await loadProducts();
  };

  const deleteProduct = async (id: string) => {
    const res = await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  if (!me) return <p>Cần đăng nhập.</p>;
  if (me.role !== "admin") return <p>Bạn không có quyền truy cập trang này.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin: Quản lý sản phẩm</h1>

      <form
        onSubmit={createProduct}
        className="bg-white rounded-xl p-4 shadow grid gap-2 md:grid-cols-2"
      >
        <input
          className="border rounded p-2"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Giá"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="border rounded p-2 md:col-span-2"
          placeholder="Ảnh (URL)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          className="border rounded p-2 md:col-span-2"
          placeholder="Danh mục"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <textarea
          className="border rounded p-2 md:col-span-2"
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="bg-black text-white rounded p-2 md:col-span-2">
          Tạo sản phẩm
        </button>
        {msg && <p className="md:col-span-2">{msg}</p>}
      </form>

      <h2 className="text-xl font-semibold mt-6 mb-2">Danh sách</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white rounded-xl p-3 shadow">
            <Image
              src={p.imageUrl}
              height={40}
              width={400}
              className=" object-cover rounded-lg"
              alt=""
            />
            <div className="font-semibold mt-2">{p.name}</div>
            <div className="text-sm">{p.price.toLocaleString()} đ</div>
            <button
              className="mt-2 w-full border rounded-lg py-2 hover:bg-gray-50"
              onClick={() => deleteProduct(p._id)}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
