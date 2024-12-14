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
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">Your Cart</h1>
        <div className="flex justify-center gap-4">
          <div className="accent-bar accent-1"></div>
          <div className="accent-bar accent-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {selectedArtwork.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-[#1F2937] rounded-lg p-4 flex items-center gap-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_API_URL
                  }/images/${encodeURIComponent(artwork.imageURL)}`}
                  alt={artwork.title}
                  className="object-cover w-full h-full transition-transform hover:scale-110"
                  onError={(e) => {
                    console.error(`Failed to load image: ${artwork.imageURL}`);
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold text-lg text-white">
                  {artwork.title}
                </h3>
                <p className="text-gray-400">{artwork.medium}</p>
                <p className="text-gray-400">{artwork.size}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-white">${artwork.price}</p>
                <button
                  onClick={() =>
                    useArtworkStore.getState().removeArtwork(artwork.id)
                  }
                  className="text-red-400 text-sm hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {selectedArtwork.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl">Your cart is empty</p>
              <p className="mt-2">Add some artwork to get started</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#1F2937] rounded-lg p-6 sticky top-4 border border-gray-800">
            <h2 className="text-xl font-semibold mb-6 gradient-text">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>

            {selectedArtwork.length > 0 ? (
              <CheckoutButton artwork={selectedArtwork[0]} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
