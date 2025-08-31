import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

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

    const { locked } = await req.json();
    if (typeof locked !== "boolean")
      return Response.json(
        { message: "locked phải là boolean" },
        { status: 400 },
      );

    const updated = await User.findByIdAndUpdate(
      id,
      { locked },
      { new: true, select: "-passwordHash" },
    );
    if (!updated)
      return Response.json({ message: "Không tìm thấy user" }, { status: 404 });

    return Response.json({
      message: "Cập nhật khóa thành công",
      user: updated,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
