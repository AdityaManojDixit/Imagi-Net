"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Checkout from "./Checkout"; // import Checkout component

const PurchasePlans = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<any | null>(null);

  const onCheckout = async () => {
    try {
      const transaction = { plan, amount, credits, buyerId };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      const data = await res.json();

      if (!data.id) {
        throw new Error("Failed to create Razorpay order");
      }

      setOrderData(data); // 👈 pass order data to Checkout
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to create order",
        duration: 4000,
        className: "error-toast",
      });
    }
  };

  return (
    <div>
      {!orderData ? (
        <Button
          onClick={onCheckout}
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      ) : (
        <Checkout orderData={orderData} />
      )}
    </div>
  );
};

export default PurchasePlans;
