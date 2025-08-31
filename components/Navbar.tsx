// components/Navbar.tsx
// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useCart } from "@/app/providers";
import { clearToken, getToken, getUserFromToken } from "@/lib/client-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { totalQty } = useCart();
  const [authed, setAuthed] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const router = useRouter();

  const updateAuthState = () => {
    const token = getToken();
    if (token) {
      setAuthed(true);
      const user = getUserFromToken();
      setUserRole(user?.role || null);
    } else {
      setAuthed(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    updateAuthState();

    // Listen for storage changes (when token is set/removed in other tabs)
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    clearToken();
    setAuthed(false);
    setUserRole(null);
    router.push("/auth/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          🍔 FoodOrder
        </Link>
        <nav className="flex-1 flex gap-4">
          <Link href="/products" className="hover:underline">
            Sản phẩm
          </Link>
          <Link href="/orders" className="hover:underline">
            Đơn hàng
          </Link>
          {userRole === "admin" && (
            <Link href="/admin/products" className="hover:underline">
              Admin
            </Link>
          )}
        </nav>
        <Link href="/cart" className="px-3 py-1 rounded bg-gray-100">
          Giỏ hàng ({totalQty})
        </Link>
        {!authed ? (
          <Link
            href="/auth/login"
            className="px-3 py-1 rounded bg-black text-white"
          >
            Đăng nhập
          </Link>
        ) : (
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Đăng xuất
          </button>
        )}
      </div>
    </header>
  );
}
