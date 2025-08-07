import mongoose, { Schema, Document } from "mongoose";

// Define an interface for product variants
interface IVariant {
  size?: string;
  color?: string;
  stock: number;
}

// Define an interface for product reviews
interface IReview {
  user: mongoose.Schema.Types.ObjectId; // Reference to user
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Define the main product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[]; // Array of image URLs
  category: string;
  subcategory?: string;
  stock: number;
  variants?: IVariant[];
  discountPrice?: number;
  ratings: IReview[];
  avgRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    stock: { type: Number, required: true, default: 0 },
    variants: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
