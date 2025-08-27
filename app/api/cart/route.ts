import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json(
        { message: "Thiếu Authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    const { items } = await req.json(); // [{ productId, quantity }]
    if (!items || !Array.isArray(items)) {
      return Response.json(
        { message: "Dữ liệu không hợp lệ" },
        { status: 400 },
      );
    }

    // Tính tổng giá
    const detailedItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const price = product.price * item.quantity;
      total += price;

      detailedItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    return Response.json({
      message: "Tạo giỏ hàng thành công",
      cart: { items: detailedItems, totalPrice: total },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
