"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// ----------------------
// CHECKOUT FORM COMPONENT
// ----------------------
const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!clientSecret || !clientSecret.includes("_secret_")) {
    return <p>Invalid payment session. Try again.</p>;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      // redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
    } else {
      toast("Payment processing...");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

// ----------------------
// PAGE COMPONENT
// ----------------------
export default function PayPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("client_secret");

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 font-bold">Client secret missing</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complete Your Payment
      </h1>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: "stripe" },
        }}
      >
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
}
