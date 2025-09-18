import { z } from 'zod';

export const checklistItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  category: z.string().min(1).max(100),
  completed: z.boolean().default(false),
});

export const checklistItemsSchema = z.object({
  items: z.array(checklistItemSchema).min(1).max(15),
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type ChecklistItems = z.infer<typeof checklistItemsSchema>;
