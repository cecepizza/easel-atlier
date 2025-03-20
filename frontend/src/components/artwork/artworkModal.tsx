"use client";

import { useArtworkStore } from "../../store/useArtworkStore";
import Modal from "../ui/modal";
import envConfig from "../../env.config";
import { useState } from "react";
import { Artwork } from "../../types";
import Image from "next/image";

interface ArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkModal({
  artwork,
  isOpen,
  onClose,
}: ArtworkModalProps) {
  const addArtwork = useArtworkStore((state) => state.addArtwork);
  const selectedArtwork = useArtworkStore((state) => state.selectedArtwork);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  if (!artwork) return null;

  const handleAddToCart = () => {
    addArtwork(artwork);
    console.log("Current cart:", selectedArtwork);
    setStatus("success");

    setTimeout(() => {
      setStatus("idle");
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#1B1E23] text-white p-8 max-w-4xl w-full mx-auto rounded-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Artwork content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image container */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-black/20">
              <Image
                src={`${envConfig.apiUrl}/images/${encodeURIComponent(
                  artwork.imageURL
                )}`}
                alt={artwork.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            </div>
          </div>

          {/* Details container */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                {artwork.title}
              </h2>
              <div className="accent-bar accent-1 w-24"></div>
            </div>

            <div className="space-y-4 text-gray-300">
              <p className="text-2xl font-semibold text-white">
                ${artwork.price}
              </p>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span>{artwork.size}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Medium</span>
                  <span>{artwork.medium}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Style</span>
                  <span>{artwork.style.join(", ")}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span>{artwork.pieceDate}</span>
                </p>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                status === "success"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] hover:from-[#4895EF] hover:to-[#4CC9F0]"
              }`}
            >
              {status === "success" ? "Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
