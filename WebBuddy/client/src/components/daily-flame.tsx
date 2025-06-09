import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function DailyFlame() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/daily-flame'],
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-[var(--dark-surface)] via-gray-900 to-[var(--dark-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--dark-border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--flame-orange)]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[var(--flame-orange)]/20 p-3 rounded-xl">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--flame-orange)]">Daily Flame</h2>
              <p className="text-gray-400 text-sm">Today's featured heat</p>
            </div>
          </div>
          <div className="bg-[var(--dark-bg)]/50 rounded-xl p-4 border border-[var(--flame-orange)]/20">
            <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error || !data?.flame) {
    return (
      <Card className="bg-gradient-to-br from-[var(--dark-surface)] via-gray-900 to-[var(--dark-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--dark-border)]">
        <div className="text-center py-8">
          <p className="text-gray-400">No daily flame available right now</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for fresh heat! 🔥</p>
        </div>
      </Card>
    );
  }

  const flame = data.flame;

  return (
    <Card className="bg-gradient-to-br from-[var(--dark-surface)] via-gray-900 to-[var(--dark-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--dark-border)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--flame-orange)]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[var(--flame-orange)]/20 p-3 rounded-xl">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--flame-orange)]">Daily Flame</h2>
            <p className="text-gray-400 text-sm">Today's featured heat</p>
          </div>
        </div>
        <div className="bg-[var(--dark-bg)]/50 rounded-xl p-4 border border-[var(--flame-orange)]/20">
          <blockquote className="text-xl font-medium text-center italic text-gray-100">
            "{flame.content}"
          </blockquote>
        </div>
        <div className="flex justify-center mt-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-[var(--flame-orange)] hover:text-[var(--flame-orange)]/80 transition-colors duration-200"
          >
            <Heart className="w-4 h-4" />
            <span>{flame.likes || 0} flames</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
