import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";
import { createToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, email, password } = await req.json();

    // ✅ Validate input fields
    if (!username || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // ✅ Check if user/email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ message: "Username or Email already in use" }, { status: 400 });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    
    const token = createToken(user._id.toString(), user.username);

    // ✅ Set secure cookie with token
    const response = NextResponse.json({
      message: "User created",
      user: { _id: user._id, username: user.username, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
