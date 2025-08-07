"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Truck, Star } from "lucide-react";
import "../../../styles/Product.css";
import Loader from "../../../components/Loader";
import { useCart } from "../../../context/cartContext"; // ✅ Import Cart Context

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[];
    category: string;
    subcategory?: string;
    variants?: { size?: string; color?: string; stock?: number }[];
    avgRating?: number;
    reviewsCount?: number;
}

export default function ProductPage() {
    const { id } = useParams();
    const { addToCart } = useCart(); // ✅ Use Cart Context
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle Add to Cart
    const handleAddToCart = async () => {
        if (!product || !selectedSize) return;

        addToCart(
            {
                productId: product._id,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
                size: selectedSize,
                quantity: 1,
                image: product.images[0], // First image as the thumbnail
            },
            1
        );

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000); // Reset after 2 sec
    };

    if (loading) return <Loader />;
    if (!product) return <p className="error">Product not found.</p>;

    return (
        <>
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb">
                Home &gt; {product.category} {product.subcategory && `> ${product.subcategory}`} &gt;{" "}
                <span className="active">{product.name}</span>
            </nav>

            <div className="product-container">
                {/* Left Section - Product Images Grid */}
                <div className="product-gallery-grid">
                    {product.images.map((img, index) => (
                        <img key={index} src={img} alt={`Product Image ${index + 1}`} />
                    ))}
                </div>

                {/* Right Section - Product Details */}
                <div className="product-details">
                    <h1>{product.name}</h1>
                    <p className="category">
                        {product.category} {product.subcategory && `> ${product.subcategory}`}
                    </p>

                    {/* Price with Discount */}
                    <p className="price">
                        {product.discountPrice ? (
                            <>
                                <span className="old-price">Rs. {product.price.toFixed(2)}</span>
                                <span className="discount-price">Rs. {product.discountPrice.toFixed(2)}</span>
                            </>
                        ) : (
                            <span>Rs. {product.price.toFixed(2)}</span>
                        )}
                    </p>

                    {/* Size Selection */}
                    <div className="size-selection">
                        <p>Sizes</p>
                        <div className="size-options">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                    key={size}
                                    className={selectedSize === size ? "selected" : ""}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="add-to-cart" disabled={!selectedSize} onClick={handleAddToCart}>
                        {selectedSize ? "Add to Cart" : "Select a Size"}
                    </button>

                    {/* Confirmation Message */}
                    {addedToCart && <p className="success-message">✅ Added to cart!</p>}

                    {/* Delivery & Availability */}
                    <p className="delivery">
                        <Truck size={18} /> Delivery Time: <strong>2-7 days</strong>
                    </p>

                    {/* Ratings */}
                    <p className="rating">
                        <Star size={18} /> {product.avgRating ? product.avgRating.toFixed(1) : "No ratings yet"} (
                        {product.reviewsCount || 0} Reviews)
                    </p>
                </div>
            </div>
        </>
    );
}
