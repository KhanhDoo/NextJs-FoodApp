"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  locked?: boolean;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const loadUsers = async () => {
    const res = await apiFetch(
      `/api/users?search=${search}&role=${roleFilter}`,
    );
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter]);

  const changeRole = async (id: string, role: "user" | "admin") => {
    await apiFetch(`/api/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    loadUsers();
  };

  const toggleLock = async (id: string, locked: boolean) => {
    await apiFetch(`/api/users/${id}/lock`, {
      method: "PATCH",
      body: JSON.stringify({ locked }),
    });
    loadUsers();
  };

  const deleteUser = async (id: string) => {
    await apiFetch(`/api/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      <div className="flex gap-2 mb-2">
        <input
          className="border rounded p-2"
          placeholder="Tìm kiếm tên/email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Khóa</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    changeRole(u._id, e.target.value as "user" | "admin")
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  className="border rounded px-2"
                  onClick={() => toggleLock(u._id, !u.locked)}
                >
                  {u.locked ? "Mở khóa" : "Khóa"}
                </button>
              </td>
              <td>
                <button
                  className="border rounded px-2 text-red-500"
                  onClick={() => deleteUser(u._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {msg && <p>{msg}</p>}
    </div>
  );
}
