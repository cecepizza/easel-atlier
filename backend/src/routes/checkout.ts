// routes/checkout.ts
import express from "express";
import { stripe } from "../services/stripe";

const router = express.Router();

// create API endpoint for checkout session for frontend call
router.post("/create-checkout-session", async (req, res) => {
  try {
    // 1. Extract and validate product details
    const { title, price, imageURL } = req.body;
    const unitAmount = Math.round(Number(price) * 100); // Convert price to number and to cents

    // 2. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images: [imageURL],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/success`, // Post-payment success page
      cancel_url: `${process.env.DOMAIN}/cancel`, // Payment cancellation page
    });

    // 3. Return session ID to frontend
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("5. Stripe error details:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
