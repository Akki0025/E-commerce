"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

const OrderConfirmation = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Countdown for auto-redirect
        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Redirect after 10 seconds
        const timeout = setTimeout(() => {
            router.push("/");
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div style={styles.container}>
            <FaCheckCircle size={80} color="black" />
            <h1 style={styles.heading}>Order Confirmed!</h1>
            <p style={styles.message}>
                Thank you for your purchase. Your order is being processed.
            </p>
            <p style={styles.redirectText}>
                Redirecting to home in <strong>{countdown}s</strong>...
            </p>
            <button onClick={() => router.push("/")} style={styles.button}>
                Shop More
            </button>
        </div>
    );
};

// ✅ Inline styles for simple black & white theme
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "white",
        color: "black",
        textAlign: "center" as "center",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginTop: "10px",
    },
    message: {
        fontSize: "1.2rem",
        marginTop: "5px",
    },
    redirectText: {
        fontSize: "1rem",
        marginTop: "10px",
        opacity: 0.7,
    },
    button: {
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "black",
        border: "none",
        cursor: "pointer",
        transition: "0.3s",
    },
};

export default OrderConfirmation;
