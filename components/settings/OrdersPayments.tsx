"use client";

import { useState, useEffect } from "react";
// import "/styles/Settings";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
}

export default function OrdersPayments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    // Fetch order history (Mock API)
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    };

    // Fetch saved payment methods (Mock API)
    const fetchPayments = async () => {
      const res = await fetch("/api/payment-methods");
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data.paymentMethods);
      }
    };

    fetchOrders();
    fetchPayments();
  }, []);

  // Remove payment method
  const removePaymentMethod = async (id: string) => {
    const res = await fetch(`/api/payment-methods/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    }
  };

  return (
    <div className="settings-details">
      <h3>Order History</h3>
      {orders.length > 0 ? (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id}>
              <span>Order #{order.id}</span>
              <span>{order.date}</span>
              <span>Total: ${order.total.toFixed(2)}</span>
              <span>Status: {order.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}

      <hr />

      <h3>Saved Payment Methods</h3>
      {paymentMethods.length > 0 ? (
        <ul className="payment-list">
          {paymentMethods.map((method) => (
            <li key={method.id}>
              <span>{method.type} - **** {method.last4}</span>
              <span>Expires: {method.expiry}</span>
              <button onClick={() => removePaymentMethod(method.id)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved payment methods.</p>
      )}
    </div>
  );
}
