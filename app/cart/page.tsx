"use client";

import { useCart } from "../../context/cartContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/cart.module.css"; // Ensure styles are updated
import Loader from "../../components/Loader";

const CartPage = () => {
    const { cart, fetchCart, addToCart, removeFromCart } = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart().then(() => setLoading(false));
    }, []);

    const handleQuantityChange = (item: any, change: number) => {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            addToCart(item, change);
        } else {
            removeFromCart(item.productId, item.size, item.color);
        }
    };

    const totalPrice = cart.reduce((total, item) => {
        return total + (item.discountPrice || item.price) * item.quantity;
    }, 0);

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.title}>Shopping Bag</h1>

            {loading ? (
                <Loader />
            ) : cart.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty</p>
            ) : (
                <div className={styles.cartLayout}>
                    {/* Left: Cart Items */}
                    <div className={styles.cartItems}>
                        {cart.map((item) => (
                            <div key={item.productId} className={styles.cartItem}>
                                <img src={item.image} alt={item.name} className={styles.productImage} />
                                <div className={styles.productDetails}>
                                    <h3 className={styles.productName}>{item.name}</h3>
                                    <p className={styles.productInfo}>
                                        Art no: {item.productId} | Color: {item.color} | Size: {item.size}
                                    </p>
                                    <p className={styles.price}>
                                        {item.discountPrice ? (
                                            <>
                                                <span className={styles.oldPrice}>Rs. {item.price}</span>
                                                <span className={styles.discountPrice}>Rs. {item.discountPrice}</span>
                                            </>
                                        ) : (
                                            <>Rs. {item.price}</>
                                        )}
                                    </p>
                                    <div className={styles.quantityControls}>
                                        <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                                    </div>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Summary Section */}
                    <div className={styles.cartSummary}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>
                        <div className={styles.summaryDetails}>
                            <p>Order Value: <span>Rs. {totalPrice.toFixed(2)}</span></p>
                            <p>Delivery: <span>FREE</span></p>
                        </div>
                        <div className={styles.summaryTotal}>
                            <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
                        </div>
                        <Link href="/checkout">
                            <button className={styles.checkoutButton}>Continue to Checkout</button>
                        </Link>

                        {/* Payment Options */}
                        <div className={styles.paymentMethods}>
                            <p>We accept:</p>
                            <div className={styles.paymentIcons}>
                                <img src="images/visa.svg" alt="Visa" />
                                <img src="images/mastercard.svg" alt="Mastercard" />
                                <span className={styles.cod}>Cash on Delivery</span>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className={styles.deliveryInfo}>
                            <p>✅ 15 days free returns. <Link href="/return-policy">Return Policy</Link></p>
                            <p>📦 Customers will receive SMS/WhatsApp updates on their registered phone number.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
