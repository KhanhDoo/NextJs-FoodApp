import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email đã tồn tại" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
    });

    return Response.json(
      { message: "Đăng ký thành công", userId: newUser._id },
      { status: 201 },
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    return Response.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}
