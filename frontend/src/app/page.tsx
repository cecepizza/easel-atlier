import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold text-center">
        Create Your Custom Art Configuration
      </h1>
      <p className="text-xl text-center max-w-2xl">
        Select from our curated collection of artworks and create your perfect
        combination.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Artwork grid will go here */}
      </div>
      <Button asChild>
        <Link href="/configure">Start Creating</Link>
      </Button>
    </div>
  );
}
