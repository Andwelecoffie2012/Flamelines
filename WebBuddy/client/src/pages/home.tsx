import Header from "@/components/header";
import DailyFlame from "@/components/daily-flame";
import FlameGenerator from "@/components/flame-generator";
import CommunitySection from "@/components/community-section";
import StatsSection from "@/components/stats-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <DailyFlame />
        <FlameGenerator />
        <CommunitySection />
        <StatsSection />
      </main>
      
      <Footer />
    </div>
  );
}
