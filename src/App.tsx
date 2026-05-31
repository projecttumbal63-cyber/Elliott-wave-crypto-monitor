import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { Analysis } from './components/Analysis';
import { Signals } from './components/Signals';
import { Watchlist } from './components/Watchlist';
import { SettingsPage } from './components/SettingsPage';
import { AppProvider, useAppContext } from './context/AppContext';

function AppContent() {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'scanner': return <Scanner />;
      case 'analysis': return <Analysis />;
      case 'signals': return <Signals />;
      case 'portfolio': return <Watchlist />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
        <footer className="border-t border-border py-4 px-6 text-center text-xs text-text-muted">
          EW Monitor — Elliott Wave Crypto Scanner © 2025 | Data refreshes automatically | Not financial advice
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
