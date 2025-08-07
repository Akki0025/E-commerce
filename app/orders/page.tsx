"use client";
import { useEffect, useState } from "react";

export default function OrderTracking({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h2>Order ID: {order._id}</h2>
      <p>Status: {order.orderStatus}</p>
      {order.trackingId && <p>Tracking ID: {order.trackingId}</p>}
    </div>
  );
}
