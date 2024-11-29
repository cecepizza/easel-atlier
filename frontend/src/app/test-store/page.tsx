"use client";
import React from "react";

import {
  useArtworkStore,
  Artwork,
  Medium,
  Style,
  Size,
} from "../../store/useArtworkStore";

// Test data
const testArtwork: Artwork = {
  id: "test1",
  title: "Test Artwork",
  imageURL: "/placeholder.jpg",
  price: 100,
  medium: Medium.PEN,
  style: [Style.REALM01],
  size: Size.MEDIUM,
  pieceDate: "10/11/1997",
  active: false,
};

export default function TestStore() {
  const { selectedArtwork, addArtwork, removeArtwork, clearSelection } =
    useArtworkStore();

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => addArtwork(testArtwork)}
        >
          Add Artwork
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => removeArtwork("test1")}
        >
          Remove
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={clearSelection}
        >
          Clear
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Selected Artwork:</h3>
        <pre className="bg-gray-100 p-4 rounded mt-2">
          {JSON.stringify(selectedArtwork, null, 2)}
        </pre>
      </div>
    </div>
  );
}
