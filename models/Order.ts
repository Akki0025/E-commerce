import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  totalAmount: number;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  trackingId?: string;
  razorpayOrderId?: string; // ✅ Add this field
  razorpayPaymentId?: string; // ✅ Add this field
  createdAt: Date;
}

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        quantity: Number,
        price: Number,
        size: String,
        color: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Processing",
    },
    trackingId: { type: String },
    razorpayOrderId: { type: String, required: true }, // ✅ Required to track Razorpay orders
    razorpayPaymentId: { type: String }, // ✅ Will be updated after payment
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
