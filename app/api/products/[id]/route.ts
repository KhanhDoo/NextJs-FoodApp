import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

// 🔹 GET /api/products/:id → ai cũng có thể xem chi tiết
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return Response.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }
    return Response.json({ product }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const payload = verifyToken(token);

    if (!payload || payload.role !== "admin") {
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });
    }

    const data = await req.json();
    const updated = await Product.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!updated) {
      return Response.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "Cập nhật thành công", product: updated },
      { status: 200 },
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}

// 🔹 DELETE /api/products/:id → admin xóa sản phẩm
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const payload = verifyToken(token);

    if (!payload || payload.role !== "admin") {
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });
    }

    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return Response.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    return Response.json({ message: "Xóa thành công" }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
