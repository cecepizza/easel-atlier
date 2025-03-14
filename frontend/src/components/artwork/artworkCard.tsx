// This component represents individual artwork cards
import { Artwork } from "../../store/useArtworkStore"; // updated import path
import envConfig from "../../env.config"; // updated import path

// Define the props interface for the ArtworkCard component
interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

// Define the ArtworkCard component
const ArtworkCard = ({ artwork, onClick }: ArtworkCardProps) => {
  // Return the JSX for the artwork card
  return (
    <div
      className="p-2 cursor-pointer transition-transform hover:scale-105"
      onClick={() => onClick(artwork)}
    >
      <img
        src={(() => {
          const url = `${envConfig.apiUrl}/images/${encodeURIComponent(
            artwork.imageURL
          )}`;
          console.log("Image URL:", url);
          return url;
        })()}
        alt={artwork.title}
        className="w-full object-contain"
        onError={(e) => {
          console.error(`failed to load image: ${artwork.imageURL}`);
          console.log(
            envConfig.apiUrl + "/images/" + encodeURIComponent(artwork.imageURL)
          );
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="mt-2 space-y-1">
        {/* <h2 className="font-bold">{artwork.title}</h2>
        <p className="text-sm text-gray-500">${artwork.price}</p> */}
      </div>
    </div>
  );
};

// Export the ArtworkCard component as the default export
export default ArtworkCard;
