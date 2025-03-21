import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ArtworkStore } from "../types";

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
      clearCart: () => set({ selectedArtwork: [] }),
    }),
    {
      name: "artwork-storage",
    }
  )
);
