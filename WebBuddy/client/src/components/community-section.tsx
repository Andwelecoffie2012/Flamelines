import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Send } from "lucide-react";

interface Flame {
  id: number;
  content: string;
  mode: string;
  author?: string;
  likes: number;
  createdAt: string;
}

export default function CommunitySection() {
  const [newFlame, setNewFlame] = useState("");
  const [authorName, setAuthorName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flamesData, isLoading } = useQuery({
    queryKey: ['/api/flames'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { content: string; mode: string; author?: string }) => {
      const response = await apiRequest("POST", "/api/flames", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setNewFlame("");
        setAuthorName("");
        toast({
          title: "🔥 Flame Submitted!",
          description: data.message || "Your flame is under review!",
        });
        // Invalidate flames query to potentially show new content
        queryClient.invalidateQueries({ queryKey: ['/api/flames'] });
      } else {
        toast({
          title: "Submission Failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit flame",
        variant: "destructive",
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (flameId: number) => {
      const response = await apiRequest("POST", `/api/flames/${flameId}/like`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate flames query to update like counts
      queryClient.invalidateQueries({ queryKey: ['/api/flames'] });
    },
  });

  const handleSubmit = () => {
    if (!newFlame.trim()) {
      toast({
        title: "Empty Flame",
        description: "Please enter a flame to submit!",
        variant: "destructive",
      });
      return;
    }

    if (newFlame.length < 10) {
      toast({
        title: "Flame Too Short",
        description: "Your flame needs at least 10 characters!",
        variant: "destructive",
      });
      return;
    }

    if (newFlame.length > 280) {
      toast({
        title: "Flame Too Long",
        description: "Keep it under 280 characters!",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      content: newFlame.trim(),
      mode: "community", // Default mode for community submissions
      author: authorName.trim() || undefined,
    });
  };

  const handleLike = (flameId: number) => {
    likeMutation.mutate(flameId);
  };

  const flames = flamesData?.flames || [];

  return (
    <Card className="bg-[var(--dark-surface)] rounded-2xl p-6 shadow-xl border border-[var(--dark-border)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">💬 Community Flames</h2>
        <p className="text-gray-400">Share your own heat with the community</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author-name" className="text-sm font-medium text-gray-300 mb-2 block">
              👤 Your Name (Optional)
            </Label>
            <Input
              id="author-name"
              type="text"
              placeholder="Anonymous Flame Dropper"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--flame-orange)] focus:border-transparent"
            />
          </div>
          <div>
            <Label htmlFor="new-flame" className="text-sm font-medium text-gray-300 mb-2 block">
              🔥 Your Flame
            </Label>
            <Input
              id="new-flame"
              type="text"
              placeholder="Drop your hottest line here..."
              value={newFlame}
              onChange={(e) => setNewFlame(e.target.value)}
              className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[var(--flame-orange)] focus:border-transparent"
              maxLength={280}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {newFlame.length}/280 characters
          </span>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending || !newFlame.trim()}
            className="bg-gradient-to-r from-[var(--flame-gold)] to-yellow-500 hover:from-yellow-500 hover:to-[var(--flame-gold)] text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {submitMutation.isPending ? (
                <div className="w-4 h-4 loading-spinner border-black border-t-transparent"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitMutation.isPending ? "Sending..." : "Send It"}
            </span>
          </Button>
        </div>

        {/* Recent Community Flames */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">🔥 Latest Community Heat</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[var(--dark-bg)]/50 rounded-lg p-4 border border-[var(--dark-border)]/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded animate-pulse w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : flames.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No community flames yet</p>
              <p className="text-sm text-gray-500 mt-2">Be the first to drop some heat! 🔥</p>
            </div>
          ) : (
            <div className="space-y-3">
              {flames.slice(0, 5).map((flame: Flame) => (
                <div 
                  key={flame.id} 
                  className="bg-[var(--dark-bg)]/50 rounded-lg p-4 border border-[var(--dark-border)]/50 hover:border-[var(--flame-orange)]/30 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--flame-orange)] to-[var(--flame-orange-dark)] rounded-full flex items-center justify-center text-sm font-bold">
                      {flame.author ? flame.author.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-100 font-medium">"{flame.content}"</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{flame.author || "Anonymous"}</span>
                        <span>{new Date(flame.createdAt).toLocaleDateString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(flame.id)}
                          disabled={likeMutation.isPending}
                          className="flex items-center gap-1 hover:text-[var(--flame-orange)] transition-colors p-0 h-auto"
                        >
                          <Heart className="w-3 h-3" />
                          <span>{flame.likes}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {flames.length > 5 && (
            <div className="text-center mt-4">
              <Button variant="ghost" className="text-[var(--flame-orange)] hover:text-[var(--flame-orange)]/80 font-medium text-sm">
                View More Community Flames →
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
