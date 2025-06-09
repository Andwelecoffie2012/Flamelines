import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

export default function StatsSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data?.stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-[var(--flame-orange)]">--</div>
          <div className="text-sm text-gray-400">Total Flames</div>
        </Card>
        <Card className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-[var(--flame-gold)]">--</div>
          <div className="text-sm text-gray-400">Generated Today</div>
        </Card>
        <Card className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-400">--</div>
          <div className="text-sm text-gray-400">Approved Flames</div>
        </Card>
      </div>
    );
  }

  const stats = data.stats;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
        <div className="text-3xl mb-2">🔥</div>
        <div className="text-2xl font-bold text-[var(--flame-orange)]">
          {formatNumber(stats.totalFlames)}
        </div>
        <div className="text-sm text-gray-400">Total Flames</div>
      </Card>
      
      <Card className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
        <div className="text-3xl mb-2">⚡</div>
        <div className="text-2xl font-bold text-[var(--flame-gold)]">
          {formatNumber(stats.totalGenerations)}
        </div>
        <div className="text-sm text-gray-400">Lines Generated</div>
      </Card>
      
      <Card className="bg-gradient-to-br from-[var(--dark-surface)] to-gray-900 rounded-2xl p-6 border border-[var(--dark-border)] text-center">
        <div className="text-3xl mb-2">✅</div>
        <div className="text-2xl font-bold text-green-400">
          {formatNumber(stats.approvedFlames)}
        </div>
        <div className="text-sm text-gray-400">Approved Flames</div>
      </Card>
    </div>
  );
}
