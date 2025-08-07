"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext"; // Import Cart Context
import { usePathname } from "next/navigation"; // ✅ Get current path
import Loader from "./Loader";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io"; // Arrow Icon
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, fetchCart, clearCart } = useCart(); // ✅ Get cart data from context
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0); // ✅ Initialize with 0
  const pathname = usePathname(); // ✅ Get current path

  useEffect(() => {
    setCartItems(cart.length); // ✅ Update cart count when cart changes
  }, [cart]); // ✅ Runs when cart updates

  useEffect(() => {
    fetchCart(); // ✅ Fetch cart when Navbar loads
  }, []); // ✅ Runs once when Navbar is mounted

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      logout();
      clearCart(); // ✅ Clears cart immediately
    } catch (error) {
      console.error(error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo - Centered */}
      <div className="upperNavbar">
        <div className="logo">
          <Link href="/">
            <img src="/logo/logofortesting.webp" alt="Logo" className="logo-img" />
          </Link>
        </div>

        {/* Right Section - Account Dropdown, Cart & Logout */}
        <div className="right-section">
          {user ? (
            <div className="account-dropdown">
              <button
                className="account-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Account <IoIosArrowDown />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link href="/settings">Settings</Link>
                  <button onClick={handleLogout} disabled={logoutLoading}>
                    {logoutLoading ? <Loader /> : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}

          {/* Cart Icon with Item Count Badge */}
          <Link href="/cart" className="cart-icon">
            <FiShoppingCart size={24} />
            {cartItems > 0 && <span className="cart-badge">{cartItems}</span>}
          </Link>
        </div>
      </div>

      {/* ✅ Hide Categories when on /settings */}
      {pathname !== "/settings" && (
        <div className="category-links">
          <Link href="/ladies">Ladies</Link>
          <Link href="/mens">Mens</Link>
          <Link href="/home">Home</Link>
          <Link href="/kids">Kids</Link>
        </div>
      )}
    </nav>
  );
}
