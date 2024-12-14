import { Artwork } from "../../store/useArtworkStore";
import envConfig from "../../env.config"; // imports your API url and other env variables

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <div
      className="p-2 cursor-pointer transition-transform hover:scale-105"
      onClick={() => onClick(artwork)}
    >
      <img
        src={`${envConfig.apiUrl}/images/${encodeURIComponent(
          artwork.imageURL
        )}`}
        alt={artwork.title}
        className="w-full object-contain"
        onError={(e) => {
          console.error("failed to load image: ${artwork.imageURL}");
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="mt-2 space-y-1">
        {/* <h2 className="font-bold">{artwork.title}</h2>
        <p className="text-sm text-gray-500">${artwork.price}</p> */}
      </div>
    </div>
  );
}
