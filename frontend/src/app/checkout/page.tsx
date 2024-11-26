// checkout page
"use client";
import React from "react";

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          {/* Order details will go here */}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Payment Details</h2>
          {/* Payment form will go here */}
        </div>
      </div>
    </div>
  );
}
