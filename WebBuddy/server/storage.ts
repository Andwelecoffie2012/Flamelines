import { flames, generations, type Flame, type InsertFlame, type Generation, type InsertGeneration } from "@shared/schema";

export interface IStorage {
  // Flames
  getFlame(id: number): Promise<Flame | undefined>;
  getFlames(limit?: number, offset?: number): Promise<Flame[]>;
  getApprovedFlames(limit?: number, offset?: number): Promise<Flame[]>;
  getDailyFlame(): Promise<Flame | undefined>;
  createFlame(flame: InsertFlame): Promise<Flame>;
  updateFlame(id: number, updates: Partial<Flame>): Promise<Flame | undefined>;
  likeFlame(id: number): Promise<Flame | undefined>;
  
  // Generations
  getGeneration(id: number): Promise<Generation | undefined>;
  getGenerations(limit?: number, offset?: number): Promise<Generation[]>;
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  updateGeneration(id: number, updates: Partial<Generation>): Promise<Generation | undefined>;
  
  // Stats
  getStats(): Promise<{
    totalFlames: number;
    totalGenerations: number;
    approvedFlames: number;
    todayFlames: number;
  }>;
}

export class MemStorage implements IStorage {
  private flames: Map<number, Flame>;
  private generations: Map<number, Generation>;
  private flameId: number;
  private generationId: number;

  constructor() {
    this.flames = new Map();
    this.generations = new Map();
    this.flameId = 1;
    this.generationId = 1;
    
    // Add some initial approved community flames
    this.seedInitialData();
  }

  private seedInitialData() {
    const initialFlames: InsertFlame[] = [
      {
        content: "That comeback was so cold, it made winter jealous ❄️",
        mode: "roast",
        author: "FlameKing",
      },
      {
        content: "Your style so fresh, it expired next week 🔥",
        mode: "bar",
        author: "BarMaster",
      },
      {
        content: "You're like WiFi - everyone's trying to connect with you but only the special ones get the password ✨",
        mode: "compliment",
        author: "SweetTalker",
      }
    ];

    initialFlames.forEach(flame => {
      const id = this.flameId++;
      const newFlame: Flame = {
        ...flame,
        id,
        likes: Math.floor(Math.random() * 100) + 10,
        isApproved: true,
        isDaily: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in past week
      };
      this.flames.set(id, newFlame);
    });

    // Set one as daily flame
    const dailyFlameId = Array.from(this.flames.keys())[0];
    const dailyFlame = this.flames.get(dailyFlameId);
    if (dailyFlame) {
      this.flames.set(dailyFlameId, { ...dailyFlame, isDaily: true });
    }
  }

  async getFlame(id: number): Promise<Flame | undefined> {
    return this.flames.get(id);
  }

  async getFlames(limit = 50, offset = 0): Promise<Flame[]> {
    const allFlames = Array.from(this.flames.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return allFlames.slice(offset, offset + limit);
  }

  async getApprovedFlames(limit = 20, offset = 0): Promise<Flame[]> {
    const approvedFlames = Array.from(this.flames.values())
      .filter(flame => flame.isApproved)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return approvedFlames.slice(offset, offset + limit);
  }

  async getDailyFlame(): Promise<Flame | undefined> {
    return Array.from(this.flames.values()).find(flame => flame.isDaily);
  }

  async createFlame(insertFlame: InsertFlame): Promise<Flame> {
    const id = this.flameId++;
    const flame: Flame = {
      ...insertFlame,
      id,
      likes: 0,
      isApproved: false, // Requires moderation
      isDaily: false,
      createdAt: new Date(),
    };
    this.flames.set(id, flame);
    return flame;
  }

  async updateFlame(id: number, updates: Partial<Flame>): Promise<Flame | undefined> {
    const flame = this.flames.get(id);
    if (!flame) return undefined;
    
    const updatedFlame = { ...flame, ...updates };
    this.flames.set(id, updatedFlame);
    return updatedFlame;
  }

  async likeFlame(id: number): Promise<Flame | undefined> {
    const flame = this.flames.get(id);
    if (!flame) return undefined;
    
    const updatedFlame = { ...flame, likes: (flame.likes || 0) + 1 };
    this.flames.set(id, updatedFlame);
    return updatedFlame;
  }

  async getGeneration(id: number): Promise<Generation | undefined> {
    return this.generations.get(id);
  }

  async getGenerations(limit = 50, offset = 0): Promise<Generation[]> {
    const allGenerations = Array.from(this.generations.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return allGenerations.slice(offset, offset + limit);
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = this.generationId++;
    const generation: Generation = {
      ...insertGeneration,
      id,
      createdAt: new Date(),
    };
    this.generations.set(id, generation);
    return generation;
  }

  async updateGeneration(id: number, updates: Partial<Generation>): Promise<Generation | undefined> {
    const generation = this.generations.get(id);
    if (!generation) return undefined;
    
    const updatedGeneration = { ...generation, ...updates };
    this.generations.set(id, updatedGeneration);
    return updatedGeneration;
  }

  async getStats(): Promise<{
    totalFlames: number;
    totalGenerations: number;
    approvedFlames: number;
    todayFlames: number;
  }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayFlames = Array.from(this.flames.values())
      .filter(flame => flame.createdAt && new Date(flame.createdAt) >= today).length;
    
    const approvedFlames = Array.from(this.flames.values())
      .filter(flame => flame.isApproved).length;

    return {
      totalFlames: this.flames.size,
      totalGenerations: this.generations.size,
      approvedFlames,
      todayFlames,
    };
  }
}

export const storage = new MemStorage();
