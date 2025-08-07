import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Product } from "../../../../models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name price images");

    const totalCount = await Product.countDocuments(); // Get total product count
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ products, totalPages });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
