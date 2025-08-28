// app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { setToken } from "@/lib/client-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      setMsg("Đăng nhập thành công!");
      setTimeout(() => router.push("/products"), 500);
    } else {
      setMsg(data.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-2xl p-6 mt-6">
      <h1 className="text-xl font-bold mb-4">Đăng nhập</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-black text-white rounded p-2">
          Đăng nhập
        </button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <p className="mt-2 text-sm">
        Chưa có tài khoản?{" "}
        <a className="underline" href="/auth/register">
          Đăng ký
        </a>
      </p>
    </div>
  );
}
