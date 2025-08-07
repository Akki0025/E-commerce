import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Order from "../../../../models/Order";
import { authenticate } from "../../../../middleware/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await authenticate(req);
    if (!user || typeof user === "object" && "error" in user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const order = await Order.findOne({ _id: params.id, userId: user.id });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
