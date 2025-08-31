import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return Response.json({ categories });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin")
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });

    const { name, slug } = await req.json();
    if (!name || !slug)
      return Response.json({ message: "Thiếu dữ liệu" }, { status: 400 });

    const created = await Category.create({ name, slug });
    return Response.json(
      { message: "Tạo danh mục thành công", category: created },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
