import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Copy, Share, Heart, Zap } from "lucide-react";

interface GenerationResponse {
  success: boolean;
  content: string;
  generationId: number;
  error?: string;
}

export default function FlameGenerator() {
  const [mode, setMode] = useState("bar");
  const [input, setInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: { mode: string; input?: string }) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json() as Promise<GenerationResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedContent(data.content);
        setGenerationId(data.generationId);
        toast({
          title: "🔥 Flame Generated!",
          description: "Your heat is ready to drop!",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: data.error || "Something went wrong. Try again!",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate flame",
        variant: "destructive",
      });
    },
  });

  const rateMutation = useMutation({
    mutationFn: async (rating: number) => {
      if (!generationId) throw new Error("No generation to rate");
      const response = await apiRequest("POST", `/api/generations/${generationId}/rate`, { rating });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thanks for the feedback!",
        description: "Your rating helps improve the flames 🔥",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      mode,
      input: input.trim() || undefined,
    });
  };

  const handleCopy = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent);
        toast({
          title: "Copied!",
          description: "Flame copied to clipboard 📋",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async () => {
    if (generatedContent && navigator.share) {
      try {
        await navigator.share({
          title: "🔥 Flame Lines",
          text: generatedContent,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleRate = (rating: number) => {
    rateMutation.mutate(rating);
  };

  return (
    <Card className="bg-[var(--dark-surface)] rounded-2xl p-6 shadow-xl border border-[var(--dark-border)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎯 Generate Your Flame</h2>
        <p className="text-gray-400">Pick your mode and let the heat flow</p>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div>
          <Label htmlFor="mode-select" className="text-sm font-medium text-gray-300 mb-2 block">
            🔥 Flame Mode
          </Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[var(--flame-orange)] focus:border-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--dark-surface)] border border-[var(--dark-border)]">
              <SelectItem value="bar">💪 Bars - Lyrical fire</SelectItem>
              <SelectItem value="flirty">😘 Flirty - Smooth moves</SelectItem>
              <SelectItem value="roast">🔥 Roasts - Pure heat</SelectItem>
              <SelectItem value="compliment">💎 Compliments - Good vibes</SelectItem>
              <SelectItem value="joke">😂 Jokes - Comedy gold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input Area */}
        <div>
          <Label htmlFor="input-text" className="text-sm font-medium text-gray-300 mb-2 block">
            ✍️ Your Setup (Optional)
          </Label>
          <Textarea
            id="input-text"
            placeholder="Type your line or setup here for personalized flames..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--flame-orange)] focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full bg-gradient-to-r from-[var(--flame-orange)] to-[var(--flame-orange-dark)] hover:from-[var(--flame-orange-dark)] hover:to-[var(--flame-orange)] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--flame-orange)]/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            {generateMutation.isPending ? (
              <div className="w-5 h-5 loading-spinner"></div>
            ) : (
              <Zap className="w-5 h-5" />
            )}
            {generateMutation.isPending ? "Generating Heat..." : "Mix the Heat"}
          </span>
        </Button>

        {/* Output Area */}
        {generatedContent && (
          <div className="animate-fade-in">
            <Card className="bg-gradient-to-r from-[var(--dark-bg)] to-gray-900 rounded-xl p-4 border border-[var(--flame-orange)]/30">
              <div className="flex items-start gap-3">
                <div className="bg-[var(--flame-orange)]/20 p-2 rounded-lg">
                  <span className="text-lg">🔥</span>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-100 mb-3">
                    "{generatedContent}"
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center gap-1 hover:text-[var(--flame-orange)] transition-colors p-1 h-auto"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center gap-1 hover:text-[var(--flame-orange)] transition-colors p-1 h-auto"
                    >
                      <Share className="w-4 h-4" />
                      Share
                    </Button>
                    {generationId && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Rate:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRate(5)}
                          disabled={rateMutation.isPending}
                          className="flex items-center gap-1 hover:text-green-400 transition-colors p-1 h-auto"
                        >
                          👍
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRate(1)}
                          disabled={rateMutation.isPending}
                          className="flex items-center gap-1 hover:text-red-400 transition-colors p-1 h-auto"
                        >
                          👎
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}
