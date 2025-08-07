import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { authenticate } from "../../../../middleware/auth";
import { Cart } from "../../../../models/Cart";

export async function POST(req: NextRequest) {
    await connectDB();

    const user = await authenticate(req);
    console.log("Authenticated User:", user);

    if (!user || typeof user === "object" && "error" in user) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const { productId, size, color } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        console.log("Received Remove Request:", { userId: user.id, productId, size, color });

        const cart = await Cart.findOne({ userId: user.userId });
        console.log("Cart Found:", cart);
        if (!cart) {
            console.log("Cart not found for user:", user.id);
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        console.log("Before Removing:", cart.items);

        cart.items = cart.items.filter((item) => {
            const isSameProduct = item.productId.toString() === productId;
            const isSameSize = size ? item.size === size : true;
            const isSameColor = color ? item.color === color : true;
            return !(isSameProduct && isSameSize && isSameColor);
        });

        await cart.save();

        console.log("After Removing:", cart.items);

        return NextResponse.json({ message: "Removed from cart", cart }, { status: 200 });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
