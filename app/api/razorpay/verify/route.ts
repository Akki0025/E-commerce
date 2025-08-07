  import { NextResponse } from "next/server";
  import crypto from "crypto";
  import Order from "../../../../models/Order";
  import { connectDB } from "../../../../lib/db";

  export async function POST(req: Request) {
      try {
          await connectDB(); // ✅ Connect to MongoDB

          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
              return NextResponse.json({ error: "Invalid payment details" }, { status: 400 });
          }

          // ✅ Fetch order from DB
          const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

          if (!order) {
              return NextResponse.json({ error: "Order not found" }, { status: 404 });
          }

          // ✅ Generate signature for verification
          const generated_signature = crypto
              .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
              .update(razorpay_order_id + "|" + razorpay_payment_id)
              .digest("hex");

          if (generated_signature !== razorpay_signature) {
              return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
          }

          // ✅ Update Order Status
          order.paymentStatus = "Paid";
          order.orderStatus = "Processing";
          order.razorpayPaymentId = razorpay_payment_id;
          await order.save();

          return NextResponse.json({ success: true, message: "Payment verified successfully" });
      } catch (error) {
          console.error("Payment Verification Error:", error);
          return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
      }
  }
