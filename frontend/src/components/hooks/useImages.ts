import { useState, useEffect } from "react";
import envConfig from "../../env.config";
import { Artwork } from "../../types";

// useImages --> fetch and manage images
const useImages = () => {
  const totalImages = 62;
  const imagesPerRow = 8;
  const spacing = 1.5;
  const verticalSpacing = 5 + (Math.random() - 0.5) * 2;
  const depthSpacing = 3 + (Math.random() - 0.5) * 2;

  const mockImages = Array.from({ length: totalImages }, (_, index) => {
    const row = Math.floor(index / imagesPerRow);
    const col = index % imagesPerRow;
    const totalRows = Math.ceil(totalImages / imagesPerRow);

    const x = (col - imagesPerRow / 2) * spacing;
    const y = (row - totalRows + 20) * verticalSpacing;
    const z = -row * depthSpacing;

    return {
      position: [x, y, z],
      rotation: [0, 0, 0],
      url: "",
    };
  });

  const [images, setImages] = useState(mockImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`${envConfig.apiUrl}/artworks`);
        const artworks = await response.json();

        const artworkImagesPromises = artworks.map(
          async (artwork: Artwork, index: number) => {
            const imageUrl = `${envConfig.apiUrl}/images/${encodeURIComponent(
              artwork.imageURL
            )}`;

            const img = new window.Image();
            img.src = imageUrl;
            await img.decode();

            return {
              position: mockImages[index % mockImages.length].position,
              rotation: mockImages[index % mockImages.length].rotation,
              url: imageUrl,
              name: artwork.title,
              width: img.width,
              height: img.height,
            };
          }
        );

        const artworkImages = await Promise.all(artworkImagesPromises);
        setImages(artworkImages);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return { images, loading };
};

export default useImages;
