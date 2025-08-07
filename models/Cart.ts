import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
    productId: mongoose.Types.ObjectId;
    size?: string;
    color?: string;
    quantity: number;
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const CartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                size: { type: String },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
    },
    { timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
