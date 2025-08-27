import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json({ message: "Thiếu Authorization" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
      return Response.json({ message: "Token không hợp lệ" }, { status: 401 });

    const { items } = await req.json(); // [{ productId, quantity }]
    if (!items || !Array.isArray(items)) {
      return Response.json(
        { message: "Dữ liệu không hợp lệ" },
        { status: 400 },
      );
    }

    let total = 0;
    const detailedItems = [];

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

    const order = new Order({
      userId: payload.id,
      items: detailedItems,
      totalPrice: total,
      status: "pending",
    });

    await order.save();

    return Response.json(
      { message: "Đặt hàng thành công", order },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json({ message: "Thiếu Authorization" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
      return Response.json({ message: "Token không hợp lệ" }, { status: 401 });

    const orders = await Order.find({ userId: payload.id }).populate(
      "items.productId",
      "name price",
    );

    return Response.json({ orders });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json({ message: err.message }, { status: 500 });
    }
    return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
  }
}
