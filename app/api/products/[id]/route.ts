import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Product } from "../../../../models/Product";
import mongoose from "mongoose";

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    await connectDB(); // Ensure MongoDB is connected

    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id).select(
      "name description price discountPrice images category subcategory variants avgRating"
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}