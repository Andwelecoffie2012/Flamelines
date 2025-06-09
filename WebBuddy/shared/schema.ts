import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flames = pgTable("flames", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  mode: text("mode").notNull(), // 'bar', 'flirty', 'roast', 'compliment', 'joke'
  author: text("author"),
  likes: integer("likes").default(0),
  isApproved: boolean("is_approved").default(false),
  isDaily: boolean("is_daily").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  mode: text("mode").notNull(),
  input: text("input"),
  output: text("output").notNull(),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFlameSchema = createInsertSchema(flames).pick({
  content: true,
  mode: true,
  author: true,
});

export const insertGenerationSchema = createInsertSchema(generations).pick({
  mode: true,
  input: true,
  output: true,
  rating: true,
});

export const generateRequestSchema = z.object({
  mode: z.enum(['bar', 'flirty', 'roast', 'compliment', 'joke']),
  input: z.string().optional(),
});

export const rateGenerationSchema = z.object({
  generationId: z.number(),
  rating: z.number().min(1).max(5),
});

export type InsertFlame = z.infer<typeof insertFlameSchema>;
export type Flame = typeof flames.$inferSelect;
export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
export type RateGenerationRequest = z.infer<typeof rateGenerationSchema>;
