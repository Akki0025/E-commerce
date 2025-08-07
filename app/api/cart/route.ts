import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { authenticate } from "../../../middleware/auth";
import { Cart } from "../../../models/Cart";
import { Product } from "../../../models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Authenticate user
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: user.id }).populate("items.productId");

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    // Format cart items with product details
    const cartItems = cart.items.map((item: any) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      discountPrice: item.productId.discountPrice,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image: item.productId.images[0], // First image of the product
    }));

    return NextResponse.json({ items: cartItems }, { status: 200 });

  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
