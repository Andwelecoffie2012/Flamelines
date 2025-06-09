import { apiRequest } from "./queryClient";

export interface FlameGenerationRequest {
  mode: 'bar' | 'flirty' | 'roast' | 'compliment' | 'joke';
  input?: string;
}

export interface FlameGenerationResponse {
  success: boolean;
  content: string;
  generationId: number;
  error?: string;
}

export interface FlameSubmissionRequest {
  content: string;
  mode: string;
  author?: string;
}

export interface FlameSubmissionResponse {
  success: boolean;
  message: string;
  flame: {
    id: number;
    content: string;
    mode: string;
  };
  error?: string;
}

export interface Flame {
  id: number;
  content: string;
  mode: string;
  author?: string;
  likes: number;
  isApproved: boolean;
  isDaily: boolean;
  createdAt: string;
}

export interface Stats {
  totalFlames: number;
  totalGenerations: number;
  approvedFlames: number;
  todayFlames: number;
}

export const api = {
  // Generate flame using AI
  generateFlame: async (request: FlameGenerationRequest): Promise<FlameGenerationResponse> => {
    const response = await apiRequest("POST", "/api/generate", request);
    return response.json();
  },

  // Submit community flame
  submitFlame: async (request: FlameSubmissionRequest): Promise<FlameSubmissionResponse> => {
    const response = await apiRequest("POST", "/api/flames", request);
    return response.json();
  },

  // Get community flames
  getFlames: async (limit = 20, offset = 0): Promise<{ flames: Flame[] }> => {
    const response = await apiRequest("GET", `/api/flames?limit=${limit}&offset=${offset}`);
    return response.json();
  },

  // Like a flame
  likeFlame: async (flameId: number): Promise<{ success: boolean; likes: number }> => {
    const response = await apiRequest("POST", `/api/flames/${flameId}/like`);
    return response.json();
  },

  // Get daily flame
  getDailyFlame: async (): Promise<{ flame: Flame }> => {
    const response = await apiRequest("GET", "/api/daily-flame");
    return response.json();
  },

  // Rate generation
  rateGeneration: async (generationId: number, rating: number): Promise<{ success: boolean }> => {
    const response = await apiRequest("POST", `/api/generations/${generationId}/rate`, { rating });
    return response.json();
  },

  // Get stats
  getStats: async (): Promise<{ stats: Stats }> => {
    const response = await apiRequest("GET", "/api/stats");
    return response.json();
  },
};
