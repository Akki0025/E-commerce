"use client";

declare global {
    interface Window {
        Razorpay: any;
    }
}

import { useState } from "react";
import { useCart } from "../../context/cartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
    const { cart, totalPrice } = useCart();
    const { id } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        console.log("This is id " ,id);
        if (cart.length === 0) return alert("Your cart is empty!");

        const cartItems = cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.discountPrice || item.price,
            size: item.size,
            color: item.color,
        }));

        setLoading(true);

        try {
            // 1️⃣ Load Razorpay script dynamically
            const loadRazorpay = () => {
                return new Promise((resolve) => {
                    if (window.Razorpay) {
                        resolve(true);
                        return;
                    }

                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                setLoading(false);
                return alert("Failed to load Razorpay. Please check your internet connection and try again.");
            }

            // 2️⃣ Create Razorpay Order
            const orderResponse = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, items: cartItems, totalAmount: totalPrice }),
            });

            const orderData = await orderResponse.json();
            if (!orderData.razorpayOrderId) {
                setLoading(false);
                return alert("Failed to create Razorpay order");
            }

            // 3️⃣ Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Your Store",
                description: "Order Payment",
                order_id: orderData.razorpayOrderId,
                handler: async function (response: any) {
                    console.log("Payment Response:", response);

                    // 4️⃣ Verify Payment
                    const verifyResponse = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyResponse.json();
                    if (verifyData.success) {
                        alert("Payment Successful! Order Placed.");
                        router.push("/order-confirmation");
                    } else {
                        alert("Payment Verification Failed.");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "9876543210",
                },
                theme: { color: "#111827" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            setLoading(false);
        } catch (error) {
            console.error("Payment Error:", error);
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white py-12 px-8 shadow-xl rounded-2xl border border-gray-100 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Add some items to your cart to continue with checkout.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Review your order and complete your purchase</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6">
                            {cart.map((item, index) => (
                                <div key={`${item.productId}-${index}`} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                                            {item.size && <span className="bg-white px-2 py-1 rounded border">Size: {item.size}</span>}
                                            {item.color && <span className="bg-white px-2 py-1 rounded border">Color: {item.color}</span>}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                <span>Tax</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
                        
                        {/* Payment Method */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="payment" className="text-gray-900 focus:ring-gray-900" defaultChecked />
                                    <div className="ml-3 flex items-center">
                                        <span className="text-sm font-medium text-gray-900">Razorpay</span>
                                        <span className="ml-2 text-xs text-gray-500">(UPI, Cards, NetBanking, Wallets)</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                                    <p className="text-xs text-gray-600 mt-1">Your payment information is encrypted and secure.</p>
                                </div>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Payment...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Pay ₹{totalPrice.toFixed(2)}
                                </div>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-gray-500 text-center mt-4">
                            By completing your purchase, you agree to our{" "}
                            <a href="#" className="text-gray-900 hover:underline">Terms of Service</a> and{" "}
                            <a href="#" className="text-gray-900 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>

                {/* Back to Cart */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                        ← Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;