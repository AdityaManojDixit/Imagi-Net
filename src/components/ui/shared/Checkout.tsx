"use client";

import { useState } from "react";

function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout({ orderData }: { orderData: any }) {
  const [loading, setLoading] = useState(false);

  async function displayRazorpay() {
    setLoading(true);

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your Company",
      description: "Plan purchase",
      image: "https://example.com/your_logo",
      order_id: orderData.id,
      callback_url: "/api/verify", 
      notes: orderData.notes,
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

    setLoading(false);
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-500 mb-6">Complete your payment securely</p>

          <button
            onClick={displayRazorpay}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ₹${orderData.amount / 100}`}
          </button>
        </div>
      </div>
    </div>
  );
}
