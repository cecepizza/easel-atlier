import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export type Artwork = {
  id: string;
  title: string;
  imageURL: string;
  pieceDate: string;
  size: Size;
  style: Style[];
  medium: Medium;
  price: number;
  active: boolean;
};

type ArtworkStore = {
  selectedArtwork: Artwork[];
  addArtwork: (artwork: Artwork) => void;

  removeArtwork: (artworkId: string) => void;
  clearSelection: () => void;
};

export const useArtworkStore = create(
  persist<ArtworkStore>(
    (set) => ({
      selectedArtwork: [],
      addArtwork: (artwork) =>
        set((state) => {
          const exists = state.selectedArtwork.some(
            (item) => item.id === artwork.id
          );

          if (exists) return state;

          return {
            selectedArtwork: [...state.selectedArtwork, artwork],
          };
        }),
      removeArtwork: (artworkId) =>
        set((state) => ({
          selectedArtwork: state.selectedArtwork.filter(
            (art) => art.id !== artworkId
          ),
        })),
      clearSelection: () => set({ selectedArtwork: [] }),
    }),
    {
      name: "artwork-storage",
    }
  )
);
