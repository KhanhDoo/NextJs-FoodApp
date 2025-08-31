"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Category = { _id: string; name: string; slug: string };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/categories", { cache: "no-store" });
    const data = await res.json();
    setCategories(data.categories || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = await apiFetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message || "Không thể tạo");
    setMsg("Tạo danh mục thành công");
    setForm({ name: "", slug: "" });
    load();
  };

  const remove = async (id: string) => {
    await apiFetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>
      <form
        onSubmit={create}
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
          placeholder="Slug (vd: com, bun, nuoc-uong)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <button className="bg-black text-white rounded p-2 md:col-span-2">
          Tạo danh mục
        </button>
        {msg && <p className="md:col-span-2">{msg}</p>}
      </form>

      <h2 className="text-xl font-semibold mt-6 mb-2">Danh sách</h2>
      <table className="w-full border bg-white rounded-xl overflow-hidden">
        <thead>
          <tr>
            <th className="text-left p-2">Tên</th>
            <th className="text-left p-2">Slug</th>
            <th className="text-left p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.slug}</td>
              <td className="p-2">
                <button
                  className="border rounded px-2"
                  onClick={() => remove(c._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
