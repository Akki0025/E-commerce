import { NextRequest, NextResponse } from "next/server";
import Product from "../../../models/Product";
import { connectDB } from "../../../lib/db";
import cloudinary from "../../../lib/cloudinary";
import { authenticate } from "../../../middleware/auth";

// GET: Fetch all products with pagination & filtering
export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page")) || 1;
        const limit = Number(url.searchParams.get("limit")) || 10;
        const category = url.searchParams.get("category");
        const minPrice = Number(url.searchParams.get("minPrice")) || 0;
        const maxPrice = Number(url.searchParams.get("maxPrice")) || Infinity;
        const search = url.searchParams.get("search") || "";

        const query: any = {
            price: { $gte: minPrice, $lte: maxPrice },
        };

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: "i" };

        const products = await Product.find(query) // Find products based on the query
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(); // Ensures proper execution
        const total = await Product.countDocuments(query);

        return NextResponse.json({ products, total, page, limit }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST: Create a new product (Protected)
export async function POST(req: NextRequest) {
    await connectDB();

    // Authenticate User
    const authResult = await authenticate(req);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const stock = Number(formData.get("stock"));

        // Upload Image to Cloudinary
        const imageFile = formData.get("image") as File;
        let imageUrl = "";

        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResponse = await cloudinary.uploader.upload_stream(
                { folder: "ecommerce" },
                (error, result) => {
                    if (error) throw new Error("Image upload failed");
                    imageUrl = result?.secure_url;
                }
            );
            uploadResponse.end(buffer);
        }

        const newProduct = await Product.create([{ name, description, price, category, stock, images: [imageUrl] }]);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
