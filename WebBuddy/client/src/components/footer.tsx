export default function Footer() {
  return (
    <footer className="bg-[var(--dark-surface)] border-t border-[var(--dark-border)] mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-[var(--flame-orange)]">Flame Lines</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Drop the heat, share the fire</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[var(--flame-orange)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--flame-orange)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--flame-orange)] transition-colors">Community Guidelines</a>
            <a href="#" className="hover:text-[var(--flame-orange)] transition-colors">API</a>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--dark-border)]">
            <p className="text-xs text-gray-500">Made with 🔥 for the culture. Keep it spicy, keep it real.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
