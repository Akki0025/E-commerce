import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import { createToken } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, password } = await req.json();
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Create token with username + userId
    const token = createToken(user._id.toString(), user.username);

    // ✅ Set cookie properly
    const response = NextResponse.json({ message: "Login successful"});
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict", // Prevents CSRF attacks
      path: "/", // Accessible everywhere
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
