import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard,
  ScanLine,
  BarChart3,
  TrendingUp,
  Settings,
  Brain,
  Activity,
  Menu,
  X
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
  const [isOpen, setIsOpen] = useState(false); // Default tertutup di mobile

  return (
    <>
      {/* Tombol Hamburger (Hanya muncul di mobile) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-bg-secondary border border-border rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-bg-secondary border-r border-border z-50 transition-all duration-300 flex flex-col ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-64'}`}>
        
        <div className="p-4 border-b border-border flex items-center gap-3 h-16 ml-12 md:ml-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">EW Monitor</h1>
            <p className="text-text-muted text-xs">Elliott Wave Scanner</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:bg-bg-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
