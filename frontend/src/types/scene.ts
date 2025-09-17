// src/types/scene.ts
import { z } from "zod";

export const sceneLocationSchema = z.object({
  id: z.number(), // 서버에서 BigInt → number 변환
  name: z.string().max(255),
  scene: z.string(), // "장면 설명"
  timestamp: z.string().optional(), // "00:15:30"
  address: z.string(),
  country: z.string().max(100),
  city: z.string().max(100),
  lat: z.number(),
  lng: z.number(),
});

export const sceneLocationsByTmdbResponseSchema = z.object({
  tmdbId: z.number(),
  items: z.array(sceneLocationSchema).max(5), // ⬅️ 5개 제한
});

export type SceneLocation = z.infer<typeof sceneLocationSchema>;
export type SceneLocationsByTmdbResponse = z.infer<
  typeof sceneLocationsByTmdbResponseSchema
>;
