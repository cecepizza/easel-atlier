import React, { useState } from "react";
import { Button } from "../ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Artwork } from "../../store/useArtworkStore";

// Initialize Stripe client-side ONCE outside component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// tells typescript : " hey this component needs an artwork object that matches the artwork type in the store "
interface CheckoutButtonProps {
  artwork: Artwork; // help catch errors if you try to use component without providing required artwork data
}

export default function CheckoutButton({ artwork }: CheckoutButtonProps) {
  // track the button's current status
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleCheckout = async () => {
    try {
      setStatus("loading");

      // 1. Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      // 2. Create checkout session via backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: artwork.title,
            price: artwork.price,
            imageURL: artwork.imageURL,
          }),
        }
      );

      // 3. Get session ID from backend
      const { sessionId } = await response.json();

      // 4. Redirect to Stripe checkout using SDK
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      // 5. Handle any redirect errors
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setStatus("error");
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      variant={status === "error" ? "destructive" : "default"}
      disabled={status === "loading"}
    >
      {status === "loading" ? "scheming..." : "purchase"}
    </Button>
  );
}

/* flow of STRIPE events 

1 - user clicks checkout button
2- frontend makes POST request to backend endpoint 
    " hey backend, create a checkout session for me " (router.post handles this request)
3- backend creates Stripe session 
    " hey stripe, create a checkout session for me " (stripe.checkout.sessions.create handles this request)
4- frontend recieves session ID 
    " hey frontend, here's the session ID " (response.json() handles this request)
5- frontend redirects to Stripes checkout page 
    " hey frontend, redirect the user to the checkout page " (router.push handles this request)

*/
