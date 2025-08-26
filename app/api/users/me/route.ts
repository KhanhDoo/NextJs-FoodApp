import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

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
    if (!payload) {
      return Response.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) {
      return Response.json({ message: "User không tồn tại" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
