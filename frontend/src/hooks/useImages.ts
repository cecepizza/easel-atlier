import { useState, useEffect } from "react";
import envConfig from "../env.config";

// useImages --> fetch and manage images

const pexel = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const totalImages = 62; // Total number of images
const imagesPerRow = 8; // How many images in each row
const spacing = 1.5; // Horizontal spacing between images
const verticalSpacing = 5 + (Math.random() - 0.5) * 2; // Increase vertical spacing between rows
const depthSpacing = 3 + (Math.random() - 0.5) * 2; // Randomly stagger depth spacing

const mockImages = Array.from({ length: totalImages }, (_, index) => {
  // Calculate row and column position
  const row = Math.floor(index / imagesPerRow);
  const col = index % imagesPerRow;
  const totalRows = Math.ceil(totalImages / imagesPerRow);

  // Calculate positions with proper spacing
  const x = (col - imagesPerRow / 2) * spacing; // Center the grid horizontally
  const y = (row - totalRows + 20) * verticalSpacing; // Center vertically
  const z = -row * depthSpacing; // Add depth for each row

  return {
    position: [x, y, z],
    rotation: [0, 0, 0],
    url: "",
  };
});

// fetch and manage images
const useImages = () => {
  const [images, setImages] = useState(mockImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`${envConfig.apiUrl}/artworks`);
        const artworks = await response.json();

        // Pre-load images and get dimensions
        const artworkImagesPromises = artworks.map(
          async (artwork: any, index: number) => {
            const imageUrl = `${envConfig.apiUrl}/images/${encodeURIComponent(
              artwork.imageURL
            )}`;

            return {
              position: mockImages[index % mockImages.length].position,
              rotation: mockImages[index % mockImages.length].rotation,
              url: imageUrl,
              name: artwork.title,
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
