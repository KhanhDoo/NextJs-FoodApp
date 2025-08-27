import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json({ message: "Thiếu Authorization" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });
    }

    const orders = await Order.find().populate("userId", "name email");
    return Response.json({ orders });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
