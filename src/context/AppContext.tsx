import React, { useState, createContext, useContext } from 'react';
import type { CryptoAsset } from '../types';
import { generateCryptoData, generateMarketStats } from '../data/cryptoData';
import type { MarketStats } from '../types';

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCrypto: string | null;
  setSelectedCrypto: (id: string | null) => void;
  cryptoData: CryptoAsset[];
  marketStats: MarketStats;
  refreshData: () => void;
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
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>(generateCryptoData);
  const [marketStats, setMarketStats] = useState<MarketStats>(generateMarketStats);

  const refreshData = () => {
    setCryptoData(generateCryptoData());
    setMarketStats(generateMarketStats());
  };

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage, selectedCrypto, setSelectedCrypto, cryptoData, marketStats, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}
