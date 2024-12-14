import { Artwork } from "../../store/useArtworkStore";
import envConfig from "../../env.config"; // imports your API url and other env variables

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <div
      className="border rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
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
        className="w-full h-48 object-cover rounded"
        onError={(e) => {
          console.error(`failed to load image: ${artwork.imageURL}`);
          console.log(envConfig.apiUrl + "/images/" + encodeURIComponent());
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="mt-2 space-y-1">
        <h2 className="font-bold">{artwork.title}</h2>
        <p className="text-sm text-gray-500">${artwork.price}</p>
      </div>
    </div>
  );
}
