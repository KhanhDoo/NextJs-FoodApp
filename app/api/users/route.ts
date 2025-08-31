import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// 🔹 GET /api/users  → chỉ admin mới được gọi
export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json(
        { message: "Thiếu Authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1] || null;
    const payload = verifyToken(token);

    if (!payload || payload.role !== "admin") {
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });
    }

    // Parse filters
    const url = new URL(req.url);
    const search = (url.searchParams.get("search") || "").trim();
    const role = (url.searchParams.get("role") || "").trim();

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role === "user" || role === "admin") {
      query.role = role;
    }

    const users = await User.find(query).select("-passwordHash");
    return Response.json({ users }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    return Response.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

// 🔹 POST /api/users  → Đăng ký user
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ message: "Email đã tồn tại" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, passwordHash, role: "user" });
    await user.save();

    return Response.json(
      { message: "Đăng ký thành công", userId: user._id },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
