// routes/checkout.ts
import express from "express";
import { stripe } from "../services/stripe";

const router = express.Router();

// create API endpoint for checkout session for frontend call
router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Starting checkout session creation...");
    console.log("Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
    // create an endpoint on your server for the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // define the product to sell
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      // chose a mode - different transcation types
      mode: "payment",
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });
    console.log("Session created successfully:", session.id);

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe error:", error);

    res
      .status(500)
      .json({
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : String(error),
      });
  }
});

export default router;
