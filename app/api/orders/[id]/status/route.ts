import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

const allowed = [
  "pending",
  "preparing",
  "delivering",
  "completed",
  "cancelled",
] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json({ message: "Thiếu Authorization" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!allowed.includes(status)) {
      return Response.json(
        { message: "Trạng thái không hợp lệ" },
        { status: 400 },
      );
    }

    const order = await Order.findById(id);
    if (!order)
      return Response.json({ message: "Không tìm thấy đơn" }, { status: 404 });

    order.status = status;
    await order.save();

    return Response.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
