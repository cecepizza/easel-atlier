import { useState, useEffect } from "react";
import envConfig from "../../env.config";

// useImages --> fetch and manage images
const totalImages = 62; // Total number of images
const imagesPerRow = 8; // How many images in each row
const spacing = 1.5; // Horizontal spacing between images
const verticalSpacing = 5 + (Math.random() - 0.5) * 2; // Increase vertical spacing between rows
const depthSpacing = 3 + (Math.random() - 0.5) * 2; // Randomly stagger depth spacing

const Illustations = Array.from({ length: totalImages }, (_, index) => {
  // Calculate row and column position
  const row = Math.floor(index / imagesPerRow);
  const col = index % imagesPerRow;
  const totalRows = Math.ceil(totalImages / imagesPerRow);

  // Calculate positions with proper spacing
  const x = (col - imagesPerRow / 2) * spacing; // Center the grid horizontally
  const y = (row - totalRows + 20) * verticalSpacing; // Center vertically
  const z = -row * depthSpacing; // Add depth for each row

  return {
    position: [x, y, z] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    url: "",
  };
});

// Define an interface for the artwork object
interface Artwork {
  imageURL: string;
  title: string;
  // Add other properties of the artwork object if needed
}

// fetch and manage images
const useFetchArtwork = () => {
  const [images, setImages] = useState(Illustations);
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

            // Fetch image dimensions
            const img = new window.Image();
            img.src = imageUrl;
            await img.decode(); // Wait for image to load

            console.log(
              `Image dimensions for ${artwork.title}:`,
              img.width,
              img.height
            );

            return {
              position: Illustations[index % Illustations.length].position,
              rotation: Illustations[index % Illustations.length].rotation,
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

export default useFetchArtwork;
