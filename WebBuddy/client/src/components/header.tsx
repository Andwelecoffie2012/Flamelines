export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[var(--dark-surface)] to-gray-900 shadow-xl border-b border-[var(--dark-border)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--flame-orange)] mb-2 animate-pulse-flame">
            🔥 Flame Lines
          </h1>
          <p className="text-gray-300 text-lg font-medium">Choose your flame mode & drop some heat</p>
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-[var(--flame-orange)] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[var(--flame-orange)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[var(--flame-orange)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </header>
  );
}
