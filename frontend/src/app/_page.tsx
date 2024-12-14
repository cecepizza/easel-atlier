"use client";
import { useEffect, useState } from "react";
import type { Artwork } from "../store/useArtworkStore";
import envConfig from "../env.config";
import ArtworkCard from "../components/artwork/artworkCard";
import ArtworkModal from "../components/artwork/artworkModal";

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]); //used to display the gallery/catalog
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null); // used to display the selected artwork in the checkout page
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log("Fetching artworks...");
        const response = await fetch(`${envConfig.apiUrl}/artworks`);
        const data = await response.json();
        console.log("Received artworks:", data);
        setArtworks(data);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-4xl font-bold text-center mb-8">Art Gallery</h1> */}
      {/* grid of artwork cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onClick={handleArtworkClick}
          />
        ))}
      </div>
      {/* artwork modal popup */}
      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
