import React, { useState, createContext, useContext, useEffect } from 'react';
import type { CryptoAsset } from '../types';
import type { MarketStats } from '../types';

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCrypto: string | null;
  setSelectedCrypto: (id: string | null) => void;
  cryptoData: CryptoAsset[];
  marketStats: MarketStats;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats>({ totalMarketCap: 0, volume24h: 0, btcDominance: 0 });

  const refreshData = async () => {
    try {
      // Fetch data dari API Binance
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      console.log("Data berhasil diupdate dari server");
      // Mapping ke format aplikasi bisa dilakukan di sini setelah struktur data disesuaikan
    } catch (error) {
      console.error("Gagal update data:", error);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage, selectedCrypto, setSelectedCrypto, cryptoData, marketStats, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}
