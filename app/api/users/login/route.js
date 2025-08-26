import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ message: "Sai email hoặc mật khẩu" }), { status: 400 });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return new Response(JSON.stringify({ message: "Sai email hoặc mật khẩu" }), { status: 400 });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return new Response(JSON.stringify({ token, user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
