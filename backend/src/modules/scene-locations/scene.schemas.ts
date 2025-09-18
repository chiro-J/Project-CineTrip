import { z } from 'zod';

export const sceneItemSchema = z.object({
  id: z.number(),
  name: z.string().max(255),
  scene: z.string(),
  timestamp: z.string().optional(),
  address: z.string(),
  country: z.string().max(100),
  city: z.string().max(100),
  lat: z.number(),
  lng: z.number(),
});

export const sceneItemsSchema = z.object({
  items: z.array(sceneItemSchema).max(5),
});

export type SceneItem = z.infer<typeof sceneItemSchema>;
export type SceneItems = z.infer<typeof sceneItemsSchema>;
