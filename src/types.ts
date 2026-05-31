export type WavePattern = 'impulse' | 'corrective-abc' | 'diagonal' | 'triangle' | 'extended-3rd' | 'running-flat' | 'zigzag';

export type WaveCount = 1 | 2 | 3 | 4 | 5 | 'A' | 'B' | 'C' | 'D' | 'E' | 'W' | 'X' | 'Y';

export type TrendDirection = 'bullish' | 'bearish' | 'neutral';

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WavePoint {
  waveNumber: WaveCount;
  price: number;
  timestamp: number;
  isConfirmed: boolean;
  fibonacciLevel?: string;
}

export interface FibonacciLevels {
  retracement236: number;
  retracement382: number;
  retracement500: number;
  retracement618: number;
  retracement786: number;
  extension1618: number;
  extension2618: number;
}

export interface ElliottWaveAnalysis {
  pattern: WavePattern;
  currentWave: WaveCount;
  trend: TrendDirection;
  completion: number; // percentage 0-100
  wavePoints: WavePoint[];
  fibonacciLevels: FibonacciLevels;
  targetPrice: number;
  stopLoss: number;
  confidence: number; // 0-100
  nextExpectedWave: WaveCount;
  subwaveCount?: string;
  invalidationLevel: number;
  priceAtWave3?: number;
  impulseTarget?: number;
  correctionDepth?: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  rank: number;
  analysis: ElliottWaveAnalysis;
  priceHistory: CandleData[];
  timeframe: string;
  lastUpdated: string;
  signals: Signal[];
}

export interface Signal {
  type: 'buy' | 'sell' | 'watch';
  strength: 'strong' | 'moderate' | 'weak';
  message: string;
  timestamp: string;
}

export interface ScannerResult {
  asset: CryptoAsset;
  patternFound: WavePattern;
  matchScore: number;
  detectedAt: string;
}

export interface MarketStats {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  activeCryptos: number;
  scanningPairs: number;
  patternsDetected: number;
}
