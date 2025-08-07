"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    discountPrice?: number;
    size?: string;
    color?: string;
    quantity: number;
    image: string;
}

interface CartContextType {
    cart: CartItem[];
    totalPrice: number;
    addToCart: (product: CartItem, quantity: number) => void;
    removeFromCart: (productId: string, size?: string, color?: string) => void;
    fetchCart: () => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // ✅ Compute total price whenever cart updates
    const totalPrice = useMemo(() => {
        return cart.reduce((total, item) => {
            return total + (item.discountPrice || item.price) * item.quantity;
        }, 0);
    }, [cart]);

    // Fetch Cart from API
    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch cart");
            const data = await res.json();
            setCart(data.items);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (product: CartItem, quantity: number) => {
        try {
            const requestData = {
                productId: product.productId,
                quantity,
                size: product.size,
                color: product.color,
            };

            console.log("Sending Request Data:", requestData);

            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(requestData),
            });

            const data = await res.json();
            console.log("API Response:", data);

            if (!res.ok) {
                throw new Error(data.error || "Failed to add to cart");
            }

            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (productId: string, size?: string, color?: string) => {
        try {
            const res = await fetch("/api/cart/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId, size, color }),
            });

            if (!res.ok) throw new Error("Failed to remove from cart");
            await fetchCart();
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenExists = document.cookie.includes("token"); // Adjust based on your auth cookie
            if (tokenExists) {
                fetchCart();
            } else {
                clearCart();
            }
        }
    }, []);

    return (
        <CartContext.Provider value={{ cart, totalPrice, addToCart, removeFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook for using Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
