import { Artwork } from "../../types";
import envConfig from "../../env.config"; // imports your API url and other env variables
import Image from "next/image";

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
      <Image
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
}
