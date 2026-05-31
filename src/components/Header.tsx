import { Bell, RefreshCw, Search, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Header() {
  const { refreshData } = useAppContext();

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search crypto, patterns, waves..."
            className="w-full bg-bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={refreshData}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-all"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-all">
          <Sun className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          EW
        </div>
      </div>
    </header>
  );
}
