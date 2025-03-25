import * as THREE from "three";

/**
 * Global Type Declaration
 *
 * extend exisiting types or declare new global types that can be accessed throughout
 * TS project
 */

declare global {
  interface Window {
    threeJsCamera?: THREE.Camera;
  }
}

// Define the Artwork type
export type Artwork = {
  id: string;
  title: string;
  imageURL: string;
  url?: string; // Alias for imageURL in display context
  pieceDate: string;
  size: string; // Adjust based on your actual data
  style: string[]; // Adjust based on your actual data
  medium: string; // Adjust based on your actual data
  price: number;
  active: boolean;
  // Add display properties
  position?: [number, number, number];
  rotation?: [number, number, number];
  name?: string; // Could be used for title
  width?: number;
  height?: number;
};

// Enums for Artwork properties
export enum Size {
  XS = "XS",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum Medium {
  PEN = "PEN",
  PENCIL = "PENCIL",
  MARKER = "MARKER",
}

export enum Style {
  REALM01 = "REALM01",
  REALM02 = "REALM02",
  REALM03 = "REALM03",
  REALM04 = "REALM04",
}

export type ArtworkStore = {
  selectedArtwork: Artwork[];
  addArtwork: (artwork: Artwork) => void;

  removeArtwork: (artworkId: string) => void;
  clearSelection: () => void;
  clearCart: () => void;
};
