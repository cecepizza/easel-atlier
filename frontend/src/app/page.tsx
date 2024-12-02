"use client";
import { useEffect, useState } from "react";
import type { Artwork } from "../store/useArtworkStore";

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log("Fetching artworks...");
        const response = await fetch("http://localhost:8000/artworks");
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Art Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="border rounded-lg p-4">
            <img
              src={`http://localhost:8000/images/${encodeURIComponent(
                artwork.imageURL
              )}`}
              alt={artwork.title}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                console.error(`Failed to load image: ${artwork.imageURL}`);
                e.currentTarget.style.display = "none";
              }}
            />
            <h2 className="font-bold mt-2">{artwork.title}</h2>
            <p>${artwork.price}</p>
            <p>Style: {artwork.style.join(", ")}</p>
            <p>Medium: {artwork.medium}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
