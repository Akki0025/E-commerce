import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";
import { authenticate } from "../../../middleware/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await authenticate(req);
    if (!user || typeof user === "object" && "error" in user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { items, totalAmount, paymentStatus } = await req.json();

    const newOrder = new Order({
      userId: user.id,
      items,
      totalAmount,
      paymentStatus,
      orderStatus: "Processing",
    });

    await newOrder.save();

    return NextResponse.json({ message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Order placement error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
