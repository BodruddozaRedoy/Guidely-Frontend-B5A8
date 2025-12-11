/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment-success` },
    });

    if (error) console.error(error);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <PaymentElement />
      <button disabled={!stripe || loading} className="btn-primary w-full mt-4">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
