import type { CryptoAsset, CandleData, FibonacciLevels, MarketStats, WaveCount, WavePattern } from '../types';

function generateCandleData(basePrice: number, days: number, trend: 'up' | 'down' | 'sideways', volatility: number = 0.02): CandleData[] {
  const data: CandleData[] = [];
  let price = basePrice;
  const now = Date.now();
  const dayMs = 86400000;

  for (let i = days; i >= 0; i--) {
    const trendBias = trend === 'up' ? 0.003 : trend === 'down' ? -0.003 : 0;
    const change = (Math.random() - 0.5) * volatility * 2 + trendBias;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const volume = Math.random() * 1000000 + 100000;

    data.push({
      time: now - i * dayMs,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(0)),
    });

    price = close;
  }
  return data;
}

function generateWavePoints(_basePrice: number, pattern: WavePattern, _currentWave: number | string): WaveCount[] {
  const waveNumbers: WaveCount[] = [];
  const waveCount = pattern.includes('abc') ? 3 : pattern.includes('triangle') ? 5 : 5;

  for (let i = 1; i <= waveCount; i++) {
    if (pattern.includes('abc')) {
      if (i === 1) waveNumbers.push('A' as WaveCount);
      else if (i === 2) waveNumbers.push('B' as WaveCount);
      else waveNumbers.push('C' as WaveCount);
    } else if (pattern.includes('triangle')) {
      if (i === 1) waveNumbers.push('A' as WaveCount);
      else if (i === 2) waveNumbers.push('B' as WaveCount);
      else if (i === 3) waveNumbers.push('C' as WaveCount);
      else if (i === 4) waveNumbers.push('D' as WaveCount);
      else waveNumbers.push('E' as WaveCount);
    } else {
      waveNumbers.push(i as WaveCount);
    }
  }

  return waveNumbers;
}

function generateFibonacciLevels(high: number, low: number): FibonacciLevels {
  const diff = high - low;
  return {
    retracement236: parseFloat((high - diff * 0.236).toFixed(2)),
    retracement382: parseFloat((high - diff * 0.382).toFixed(2)),
    retracement500: parseFloat((high - diff * 0.5).toFixed(2)),
    retracement618: parseFloat((high - diff * 0.618).toFixed(2)),
    retracement786: parseFloat((high - diff * 0.786).toFixed(2)),
    extension1618: parseFloat((high + diff * 0.618).toFixed(2)),
    extension2618: parseFloat((high + diff * 1.618).toFixed(2)),
  };
}

const cryptoConfigs = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 104250, marketCap: 2070000000000, pattern: 'impulse' as WavePattern, currentWave: 3, trend: 'bullish' as const, confidence: 92, timeframe: '1D' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3890, marketCap: 468000000000, pattern: 'extended-3rd' as WavePattern, currentWave: 3, trend: 'bullish' as const, confidence: 88, timeframe: '1D' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 720, marketCap: 108000000000, pattern: 'corrective-abc' as WavePattern, currentWave: 'C', trend: 'bearish' as const, confidence: 78, timeframe: '4H' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 187, marketCap: 91000000000, pattern: 'impulse' as WavePattern, currentWave: 5, trend: 'bullish' as const, confidence: 85, timeframe: '1D' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 2.45, marketCap: 140000000000, pattern: 'triangle' as WavePattern, currentWave: 'D', trend: 'neutral' as const, confidence: 72, timeframe: '4H' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.87, marketCap: 31000000000, pattern: 'zigzag' as WavePattern, currentWave: 'B', trend: 'neutral' as const, confidence: 68, timeframe: '1D' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.385, marketCap: 57000000000, pattern: 'impulse' as WavePattern, currentWave: 2, trend: 'bullish' as const, confidence: 75, timeframe: '4H' },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 31.5, marketCap: 13000000000, pattern: 'corrective-abc' as WavePattern, currentWave: 'A', trend: 'bearish' as const, confidence: 81, timeframe: '1D' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 19.8, marketCap: 12500000000, pattern: 'diagonal' as WavePattern, currentWave: 3, trend: 'bullish' as const, confidence: 79, timeframe: '4H' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 5.12, marketCap: 7800000000, pattern: 'running-flat' as WavePattern, currentWave: 'C', trend: 'bearish' as const, confidence: 71, timeframe: '1D' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', price: 4.32, marketCap: 13800000000, pattern: 'impulse' as WavePattern, currentWave: 1, trend: 'bullish' as const, confidence: 83, timeframe: '4H' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', price: 4.75, marketCap: 5700000000, pattern: 'extended-3rd' as WavePattern, currentWave: 3, trend: 'bullish' as const, confidence: 86, timeframe: '1D' },
  { id: 'render', symbol: 'RNDR', name: 'Render', price: 8.92, marketCap: 4600000000, pattern: 'impulse' as WavePattern, currentWave: 4, trend: 'bullish' as const, confidence: 77, timeframe: '4H' },
  { id: 'injective', symbol: 'INJ', name: 'Injective', price: 18.5, marketCap: 1800000000, pattern: 'zigzag' as WavePattern, currentWave: 'A', trend: 'bearish' as const, confidence: 74, timeframe: '1D' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', price: 0.62, marketCap: 2900000000, pattern: 'triangle' as WavePattern, currentWave: 'E', trend: 'neutral' as const, confidence: 69, timeframe: '4H' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', price: 1.38, marketCap: 2100000000, pattern: 'impulse' as WavePattern, currentWave: 3, trend: 'bullish' as const, confidence: 80, timeframe: '1D' },
  { id: 'fetch', symbol: 'FET', name: 'Artificial Superintelligence', price: 1.25, marketCap: 3100000000, pattern: 'corrective-abc' as WavePattern, currentWave: 'B', trend: 'neutral' as const, confidence: 73, timeframe: '4H' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', price: 0.0000145, marketCap: 6100000000, pattern: 'impulse' as WavePattern, currentWave: 5, trend: 'bullish' as const, confidence: 82, timeframe: '1D' },
  { id: 'celestia', symbol: 'TIA', name: 'Celestia', price: 3.85, marketCap: 2100000000, pattern: 'diagonal' as WavePattern, currentWave: 4, trend: 'neutral' as const, confidence: 66, timeframe: '4H' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa', price: 0.128, marketCap: 3200000000, pattern: 'extended-3rd' as WavePattern, currentWave: 3, trend: 'bullish' as const, confidence: 89, timeframe: '1D' },
];

export function generateCryptoData(): CryptoAsset[] {
  return cryptoConfigs.map((config) => {
    const change24h = (Math.random() - 0.4) * 15;
    const volatility = config.pattern.includes('corrective') || config.pattern === 'running-flat' ? 0.03 : 0.02;
    const trend = config.trend === 'bullish' ? 'up' : config.trend === 'bearish' ? 'down' : 'sideways';
    const priceHistory = generateCandleData(config.price, 60, trend, volatility);

    const waveNumbers = generateWavePoints(config.price, config.pattern, config.currentWave);
    const baseWavePrices = waveNumbers.map((_, i) => {
      const basePrice = config.price;
      if (config.pattern.includes('abc')) {
        if (i === 0) return basePrice * 0.88;
        if (i === 1) return basePrice * 0.95;
        return basePrice * 0.82;
      }
      if (config.pattern.includes('triangle')) {
        return basePrice * (0.85 + i * 0.04 + (Math.random() - 0.5) * 0.02);
      }
      if (i === 0) return basePrice * 0.82;
      if (i === 1) return basePrice * 0.76;
      if (i === 2) return basePrice * 0.95;
      if (i === 3) return basePrice * 0.87;
      return basePrice * 1.08;
    });

    const wavePoints = waveNumbers.map((wn, i) => ({
      waveNumber: wn,
      price: parseFloat(baseWavePrices[i].toFixed(2)),
      timestamp: Date.now() - 86400000 * (waveNumbers.length - i),
      isConfirmed: (typeof config.currentWave === 'number' && typeof wn === 'number' && config.currentWave > wn) ||
                   (typeof config.currentWave === 'string' && typeof wn === 'string' && 'ABCDE'.indexOf(config.currentWave) > 'ABCDE'.indexOf(wn)),
      fibonacciLevel: typeof wn === 'number'
        ? wn === 1 ? '0' : wn === 2 ? '0.382' : wn === 3 ? '1.618' : wn === 4 ? '0.5' : '2.618'
        : typeof wn === 'string'
          ? wn === 'A' ? '0' : wn === 'B' ? '0.382' : wn === 'C' ? '1.0' : wn === 'D' ? '0.618' : '0.786'
          : undefined,
    }));

    const fibHigh = Math.max(...wavePoints.map(p => p.price)) * 1.05;
    const fibLow = Math.min(...wavePoints.map(p => p.price)) * 0.95;
    const fibonacciLevels = generateFibonacciLevels(fibHigh, fibLow);

    const completion = typeof config.currentWave === 'number'
      ? (config.currentWave / 5) * 100
      : ({ 'A': 33, 'B': 66, 'C': 100, 'D': 75, 'E': 90, 'W': 25, 'X': 50, 'Y': 75 } as Record<string, number>)[String(config.currentWave)] || 50;

    const nextWave = typeof config.currentWave === 'number'
      ? (config.currentWave < 5 ? (config.currentWave + 1) as WaveCount : 'A' as WaveCount)
      : ({ 'A': 'B' as WaveCount, 'B': 'C' as WaveCount, 'C': 1 as WaveCount, 'D': 'E' as WaveCount, 'E': 1 as WaveCount } as Record<string, WaveCount>)[String(config.currentWave)] || 1 as WaveCount;

    const targetPrice = config.trend === 'bullish'
      ? config.price * (1 + Math.random() * 0.15 + 0.05)
      : config.trend === 'bearish'
        ? config.price * (1 - Math.random() * 0.1 - 0.05)
        : config.price * (1 + (Math.random() - 0.5) * 0.1);

    const stopLoss = config.trend === 'bullish'
      ? config.price * (1 - Math.random() * 0.08 - 0.03)
      : config.trend === 'bearish'
        ? config.price * (1 + Math.random() * 0.08 + 0.03)
        : config.price * (1 - 0.05);

    const invalidationLevel = config.trend === 'bullish'
      ? Math.min(...wavePoints.map(p => p.price)) * 0.97
      : Math.max(...wavePoints.map(p => p.price)) * 1.03;

    const signals = generateSignals(config.pattern, config.currentWave, config.trend, config.confidence);

    return {
      id: config.id,
      symbol: config.symbol,
      name: config.name,
      price: config.price,
      priceChange24h: parseFloat(change24h.toFixed(2)),
      marketCap: config.marketCap,
      volume24h: config.marketCap * 0.05 * (0.5 + Math.random()),
      image: '',
      rank: cryptoConfigs.indexOf(config) + 1,
      analysis: {
        pattern: config.pattern,
        currentWave: config.currentWave as WaveCount,
        trend: config.trend,
        completion,
        wavePoints,
        fibonacciLevels,
        targetPrice: parseFloat(targetPrice.toFixed(config.price < 1 ? 6 : 2)),
        stopLoss: parseFloat(stopLoss.toFixed(config.price < 1 ? 6 : 2)),
        confidence: config.confidence,
        nextExpectedWave: nextWave,
        subwaveCount: config.pattern === 'extended-3rd' ? '3-iii extended' : config.pattern === 'zigzag' ? 'A-B-C 5-3-5' : 'standard',
        invalidationLevel: parseFloat(invalidationLevel.toFixed(config.price < 1 ? 6 : 2)),
        priceAtWave3: typeof config.currentWave === 'number' && config.currentWave >= 3 ? wavePoints.find(p => p.waveNumber === 3)?.price : undefined,
        impulseTarget: config.pattern.includes('impulse') || config.pattern === 'extended-3rd' ? parseFloat((config.price * 1.15).toFixed(config.price < 1 ? 6 : 2)) : undefined,
        correctionDepth: config.pattern.includes('abc') || config.pattern === 'zigzag' ? '38.2-61.8%' : undefined,
      },
      priceHistory,
      timeframe: config.timeframe,
      lastUpdated: new Date().toISOString(),
      signals,
    };
  });
}

function generateSignals(pattern: WavePattern, currentWave: number | string, trend: 'bullish' | 'bearish' | 'neutral', confidence: number) {
  const signals: Array<{ type: 'buy' | 'sell' | 'watch'; strength: 'strong' | 'moderate' | 'weak'; message: string; timestamp: string }> = [];
  const strength = confidence > 80 ? 'strong' : confidence > 65 ? 'moderate' : 'weak';

  if (trend === 'bullish' && typeof currentWave === 'number') {
    if (currentWave === 1) {
      signals.push({ type: 'watch', strength, message: `Early Wave 1 detected — potential impulse forming. Wait for Wave 2 pullback.`, timestamp: new Date().toISOString() });
    } else if (currentWave === 2) {
      signals.push({ type: 'buy', strength: 'strong', message: `Wave 2 pullback nearing completion. Prepare for Wave 3 entry near Fibonacci 0.618.`, timestamp: new Date().toISOString() });
    } else if (currentWave === 3) {
      signals.push({ type: 'buy', strength: 'moderate', message: `Wave 3 in progress — strongest impulse wave. Trail stops above Wave 2 low.`, timestamp: new Date().toISOString() });
    } else if (currentWave === 4) {
      signals.push({ type: 'watch', strength: 'moderate', message: `Wave 4 correction forming. Look for shallow pullback to 0.382 Fib.`, timestamp: new Date().toISOString() });
    } else if (currentWave === 5) {
      signals.push({ type: 'sell', strength: 'strong', message: `Wave 5 completion imminent. Consider taking profits. ABC correction likely next.`, timestamp: new Date().toISOString() });
    }
  } else if (trend === 'bearish') {
    signals.push({ type: 'sell', strength: strength === 'strong' ? 'strong' : 'moderate', message: `Bearish ${pattern} pattern detected. Look for short opportunities.`, timestamp: new Date().toISOString() });
  } else {
    signals.push({ type: 'watch', strength, message: `${pattern} pattern forming. Wait for breakout confirmation.`, timestamp: new Date().toISOString() });
  }

  if (pattern === 'extended-3rd') {
    signals.push({ type: 'buy', strength: 'moderate', message: `Extended Wave 3 identified — expect larger than normal price movement.`, timestamp: new Date().toISOString() });
  }

  if (confidence > 85) {
    signals.push({ type: 'buy', strength: 'strong', message: `High confidence Elliott Wave setup (${confidence}%). Strong signal detected.`, timestamp: new Date().toISOString() });
  }

  return signals;
}

export function generateMarketStats(): MarketStats {
  return {
    totalMarketCap: 3420000000000,
    totalVolume24h: 128000000000,
    btcDominance: 58.2,
    activeCryptos: 13847,
    scanningPairs: cryptoConfigs.length,
    patternsDetected: cryptoConfigs.filter(c => c.confidence > 70).length,
  };
}

export function getPatternLabel(pattern: WavePattern): string {
  const labels: Record<WavePattern, string> = {
    'impulse': '5-Wave Impulse',
    'corrective-abc': 'A-B-C Corrective',
    'diagonal': 'Leading Diagonal',
    'triangle': 'Contracting Triangle',
    'extended-3rd': 'Extended Wave 3',
    'running-flat': 'Running Flat',
    'zigzag': 'Zigzag (5-3-5)',
  };
  return labels[pattern];
}

export function getPatternColor(pattern: WavePattern): string {
  switch (pattern) {
    case 'impulse':
    case 'extended-3rd':
      return '#10b981';
    case 'corrective-abc':
    case 'running-flat':
    case 'zigzag':
      return '#ef4444';
    case 'diagonal':
      return '#f59e0b';
    case 'triangle':
      return '#8b5cf6';
    default:
      return '#06b6d4';
  }
}

export function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
}
