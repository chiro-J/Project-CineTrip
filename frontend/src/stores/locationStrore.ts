// src/stores/locationStore.ts
import { create } from "zustand";
import { apiHelpers } from "../services/api";
import type { SceneLocation } from "../types/scene";

type LocationState = {
  loading: boolean;
  error?: string;
  items: SceneLocation[];
  loadByTmdb: (
    tmdbId: number,
    opts?: {
      regen?: boolean;
      movieInfo?: {
        title?: string;
        originalTitle?: string;
        country?: string;
        language?: string;
      };
    }
  ) => Promise<void>;
  reset: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  loading: false,
  items: [],
  async loadByTmdb(tmdbId, opts) {
    set({ loading: true, error: undefined });
    try {
      const data = await apiHelpers.fetchSceneLocationsByTmdb(tmdbId, opts);
      set({ items: data.items, loading: false });
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Failed to load scene-locations";
      set({ error: msg, loading: false });
    }
  },
  reset() {
    set({ loading: false, error: undefined, items: [] });
  },
}));
