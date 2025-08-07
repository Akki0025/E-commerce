import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { authenticate } from "../../../../middleware/auth";
import { Cart } from "../../../../models/Cart";
import { Product } from "../../../../models/Product";
import mongoose, { ObjectId } from "mongoose";

export async function POST(req: NextRequest) {
    await connectDB();

    const user = await authenticate(req);
    console.log("Authenticated User:", user);

    if (!user || !user.userId) {
        console.error("Authentication failed: User ID not found.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user.userId); // ✅ Use `user.userId`
    console.log("User ID from Auth:", userId);

    try {
        const { productId, size, quantity } = await req.json();
        console.log("Received Data:", { productId, size, quantity });

        if (!productId) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const normalizedSize = size?.trim();
        console.log("Searching for Variant:", { size: normalizedSize });

        const variant = product.variants?.find((v) => v.size === normalizedSize);
        console.log("Variant Found:", variant);

        if (!variant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 400 });
        }

        console.log("Variant Stock:", variant.stock, "Requested Quantity:", quantity);
        if (variant.stock < quantity) {
            return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
        }

        // ✅ Fetch the correct user's cart
        let cart = await Cart.findOne({ userId });
        console.log("Fetched Cart:", cart);

        if (!cart) {
            cart = new Cart({ userId, items: [] });
            console.log("New Cart Created:", cart);
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, size, quantity });
        }

        await cart.save();
        return NextResponse.json({ message: "Added to cart", cart }, { status: 200 });

    } catch (error) {
        console.error("Error Adding to Cart:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
