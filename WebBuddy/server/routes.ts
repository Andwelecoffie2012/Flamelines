import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFlame } from "./openai";
import { 
  insertFlameSchema, 
  generateRequestSchema, 
  rateGenerationSchema,
  insertGenerationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate flame line using OpenAI
  app.post("/api/generate", async (req, res) => {
    try {
      const { mode, input } = generateRequestSchema.parse(req.body);
      
      const generatedContent = await generateFlame(mode, input);
      
      // Store the generation
      const generation = await storage.createGeneration({
        mode,
        input: input || "",
        output: generatedContent,
      });
      
      res.json({
        success: true,
        content: generatedContent,
        generationId: generation.id,
      });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate content",
      });
    }
  });

  // Rate a generation
  app.post("/api/generations/:id/rate", async (req, res) => {
    try {
      const generationId = parseInt(req.params.id);
      const { rating } = rateGenerationSchema.parse({ 
        generationId, 
        rating: req.body.rating 
      });
      
      const updatedGeneration = await storage.updateGeneration(generationId, { rating });
      
      if (!updatedGeneration) {
        return res.status(404).json({ error: "Generation not found" });
      }
      
      res.json({ success: true, generation: updatedGeneration });
    } catch (error) {
      console.error("Rating error:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Invalid rating data" 
      });
    }
  });

  // Submit community flame
  app.post("/api/flames", async (req, res) => {
    try {
      const flameData = insertFlameSchema.parse(req.body);
      
      // Basic content filtering
      if (flameData.content.length < 10) {
        return res.status(400).json({ error: "Flame too short. Minimum 10 characters." });
      }
      
      if (flameData.content.length > 280) {
        return res.status(400).json({ error: "Flame too long. Maximum 280 characters." });
      }
      
      const flame = await storage.createFlame(flameData);
      
      res.json({
        success: true,
        message: "Your flame has been submitted for review!",
        flame: {
          id: flame.id,
          content: flame.content,
          mode: flame.mode,
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid flame data",
      });
    }
  });

  // Get community flames (approved only)
  app.get("/api/flames", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const flames = await storage.getApprovedFlames(limit, offset);
      res.json({ flames });
    } catch (error) {
      console.error("Get flames error:", error);
      res.status(500).json({ error: "Failed to fetch flames" });
    }
  });

  // Like a flame
  app.post("/api/flames/:id/like", async (req, res) => {
    try {
      const flameId = parseInt(req.params.id);
      const updatedFlame = await storage.likeFlame(flameId);
      
      if (!updatedFlame) {
        return res.status(404).json({ error: "Flame not found" });
      }
      
      res.json({ success: true, likes: updatedFlame.likes });
    } catch (error) {
      console.error("Like error:", error);
      res.status(500).json({ error: "Failed to like flame" });
    }
  });

  // Get daily flame
  app.get("/api/daily-flame", async (req, res) => {
    try {
      const dailyFlame = await storage.getDailyFlame();
      
      if (!dailyFlame) {
        return res.status(404).json({ error: "No daily flame available" });
      }
      
      res.json({ flame: dailyFlame });
    } catch (error) {
      console.error("Daily flame error:", error);
      res.status(500).json({ error: "Failed to fetch daily flame" });
    }
  });

  // Get app statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ stats });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
