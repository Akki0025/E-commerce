import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function authenticate(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return null; // ❌ No token found
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // ✅ Return user data
  } catch (error) {
    return null; // ❌ Invalid token
  }
}
