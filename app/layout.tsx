import type { Metadata } from "next";
import Navbar from "../components/Navbar"; // Import Navbar
import Footer from "../components/Footer"; // Import Footer
import { AuthProvider } from "../context/AuthContext";
import "./globals.css"
import { CartProvider } from "../context/cartContext"; // ✅ Import Cart Provider

export const metadata: Metadata = {
  title: "E-Commerce | Clothing & Home Decor",
  description: "Shop for trendy clothing and stylish home decorations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <CartProvider> {/* ✅ Wrap in CartProvider */}
            <Navbar /> {/* Navbar at the top */}
            <main className="min-h-screen">{children}</main> {/* Main content */}
            <Footer /> {/* Footer at the bottom */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
