"use client";
import Link from "next/link";
import "../styles/Home.css";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/newarrivals?limit=10&page=${page}`);
            const data = await res.json();
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    return (
        <div>
            <section className="hero">
                <div className="hero-overlay"></div> {/* Gradient Overlay */}
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Discover Trendy Clothing & Stylish Home Decor</h1>
                        <p>Shop the latest fashion and home essentials.</p>
                        <Link href="/shop" className="shop-btn">Shop Now</Link>
                    </div>
                </div>
            </section>

            <section className="new-arrivals">
                <h2>New Arrivals</h2>

                {loading ? (
                    <div className="loader-container">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div className="product-grid">
                            {products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <Link href={`/product/${product._id}`} className="product-link">
                                        <img src={product.images[0]} alt={product.name} />
                                        <p className="product-name">{product.name}</p>
                                        <p className="product-price">${product.price.toFixed(2)}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Buttons */}
                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Previous</button>
                            <span>Page {page} of {totalPages}</span>
                            <button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
