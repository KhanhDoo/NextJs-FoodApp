import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin")
      return NextResponse.json(
        { message: "Bạn không có quyền" },
        { status: 403 },
      );

    const data = await req.json();
    const updated = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!updated)
      return NextResponse.json(
        { message: "Không tìm thấy danh mục" },
        { status: 404 },
      );
    return NextResponse.json({
      message: "Cập nhật thành công",
      category: updated,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Lỗi không xác định" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin")
      return NextResponse.json(
        { message: "Bạn không có quyền" },
        { status: 403 },
      );

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { message: "Không tìm thấy danh mục" },
        { status: 404 },
      );
    return NextResponse.json({ message: "Đã xóa danh mục" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Lỗi không xác định" },
      { status: 500 },
    );
  }
}
