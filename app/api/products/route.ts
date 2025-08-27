import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

// 🔹 GET /api/products → tất cả user có thể xem danh sách
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return Response.json({ products }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}

// 🔹 POST /api/products → chỉ admin mới thêm sản phẩm
export async function POST(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const payload = verifyToken(token);

    if (!payload || payload.role !== "admin") {
      return Response.json({ message: "Bạn không có quyền" }, { status: 403 });
    }

    const { name, description, price, imageUrl, category } = await req.json();
    if (!name || !description || !price || !imageUrl || !category) {
      return Response.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
    });
    await product.save();

    return Response.json(
      { message: "Thêm sản phẩm thành công", product },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
