import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { authenticate } from "../../../../middleware/auth";
import { Cart } from "../../../../models/Cart";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    await connectDB();

    const user = await authenticate(req);
    if (!user || typeof user === "object" && "error" in user) {
        return user;
    }

    try {
        const { productId, size, quantity } = await req.json();
        if (!productId || !size || quantity < 1) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Fetch user's cart
        let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(user.id) });
        if (!cart) {
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        // Find the item in the cart
        const item = cart.items.find(
            (i) => i.productId.toString() === productId && i.size === size
        );

        if (!item) {
            return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
        }

        // Update quantity
        item.quantity = quantity;

        // Save the updated cart
        await cart.save();

        return NextResponse.json({ message: "Quantity updated", cart }, { status: 200 });

    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
