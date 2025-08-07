"use client";

import { useState } from "react";
import Link from "next/link";
import "../styles/Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setMessage("Subscribed successfully! 🎉");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Branding & Description */}
        <div className="footer-section">
          <h2 className="footer-logo">E-Commerce</h2>
          <p>Discover high-quality fashion and home décor, curated for elegance.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-section">
          <h3>Stay Updated</h3>
          <p>Join our newsletter for the latest trends and exclusive offers.</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
}
