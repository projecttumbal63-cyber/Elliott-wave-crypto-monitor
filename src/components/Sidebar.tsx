import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard,
  ScanLine,
  BarChart3,
  TrendingUp,
  Settings,
  Brain,
  Activity,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scanner', label: 'Wave Scanner', icon: ScanLine },
  { id: 'analysis', label: 'Analysis', icon: Brain },
  { id: 'signals', label: 'Signals', icon: TrendingUp },
  { id: 'portfolio', label: 'Watchlist', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage } = useAppContext();
  const expanded = true;

  return (
    <div className={`fixed left-0 top-0 h-full bg-bg-secondary border-r border-border z-50 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'} flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3 h-16">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {expanded && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">EW Monitor</h1>
            <p className="text-text-muted text-xs">Elliott Wave Scanner</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent' : ''}`} />
              {expanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2 text-text-muted text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {expanded && <span>Live scanning 20 pairs</span>}
        </div>
      </div>
    </div>
  );
}
