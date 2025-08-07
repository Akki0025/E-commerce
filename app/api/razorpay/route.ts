import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import Order from "../../../models/Order";
import { connectDB } from "../../../lib/db";

export async function POST(req: Request) {
    try {
        await connectDB(); // ✅ Connect to MongoDB

        const { userId, items, totalAmount } = await req.json();
        console.log("Order Details:", { userId, items, totalAmount });

        if (!userId || !items || items.length === 0 || !totalAmount || Number(totalAmount) <= 0) {
            return NextResponse.json({ error: "Invalid order details" }, { status: 400 });
        }

        // ✅ Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // ✅ Convert `totalAmount` to paise (integer)
        const amountInPaise = Math.round(Number(totalAmount) * 100);

        // ✅ Create order in Razorpay
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: true, // Auto-capture payment
        });

        // ✅ Save order to MongoDB
        const newOrder = new Order({
            userId: new mongoose.Types.ObjectId(userId),
            items,
            totalAmount,
            razorpayOrderId: razorpayOrder.id, // Save Razorpay Order ID
            paymentStatus: "Pending",
            orderStatus: "Processing",
        });

        await newOrder.save();

        return NextResponse.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (error: any) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ 
            error: "Failed to create order", 
            details: error.message || error 
        }, { status: 500 });
    }
}
