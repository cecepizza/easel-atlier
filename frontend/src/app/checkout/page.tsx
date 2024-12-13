// checkout page
"use client";
import React from "react";
import CheckoutButton from "../../components/checkout/checkoutButton";
import { useArtworkStore } from "../../store/useArtworkStore";
import Image from "next/image";

export default function CheckoutPage() {
  const selectedArtwork = useArtworkStore((state) => state.selectedArtwork);
  const total = selectedArtwork.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {selectedArtwork.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
            >
              <div className="w-24 h-24 relative flex-shrink-0">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_API_URL
                  }/images/${encodeURIComponent(artwork.imageURL)}`}
                  alt={artwork.title}
                  className="rounded-md object-cover w-full h-full"
                  onError={(e) => {
                    console.error(`Failed to load image: ${artwork.imageURL}`);
                    e.currentTarget.src = "/placeholder.jpg"; // Fallback image
                  }}
                />
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{artwork.title}</h3>
                <p className="text-gray-600">{artwork.medium}</p>
                <p className="text-gray-600">{artwork.size}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">${artwork.price}</p>
                <button
                  onClick={() =>
                    useArtworkStore.getState().removeArtwork(artwork.id)
                  }
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Takes up 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>

            {selectedArtwork.length > 0 ? (
              <CheckoutButton artwork={selectedArtwork[0]} />
            ) : (
              <p className="text-center text-gray-500">Your cart is empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
