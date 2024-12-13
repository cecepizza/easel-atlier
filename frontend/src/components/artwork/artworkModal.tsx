"use client";

import { Artwork, useArtworkStore } from "../../store/useArtworkStore";
import Modal from "../ui/modal";
import envConfig from "../../env.config";
import { useState } from "react";

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
      <div className="p-6 space-y-4">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          x
        </button>
        {/* artwork content  */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <img
              src={`${envConfig.apiUrl}/images/${encodeURIComponent(
                artwork.imageURL
              )}`}
              alt={artwork.title}
              className="w-full h-[400px] object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.jpg"; // optional fallback image
              }}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{artwork.title}</h2>
            <div className="space-y-2">
              <p className="text-xl font-semibold">${artwork.price}</p>
              <p>Size: {artwork.size}</p>
              <p>Medium: {artwork.medium}</p>
              <p>Style: {artwork.style.join(", ")}</p>
              <p>Date: {artwork.pieceDate}</p>
            </div>

            {/* We'll add the AddToCart button here later */}
            <button
              // 3- connect to button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
