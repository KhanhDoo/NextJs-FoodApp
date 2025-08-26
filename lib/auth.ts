import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: "user" | "admin";
}

export function verifyToken(token: string | null): JwtPayload | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}
