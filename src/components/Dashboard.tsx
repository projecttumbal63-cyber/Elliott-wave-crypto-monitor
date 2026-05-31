import { TrendingUp, TrendingDown, Activity, ArrowUpRight, Target, Zap, Eye, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CryptoTable } from './CryptoTable';
import { WaveChart } from './WaveChart';
import { formatNumber, formatPrice, getPatternLabel, getPatternColor } from '../data/cryptoData';

export function Dashboard() {
  const { cryptoData, marketStats, refreshData } = useAppContext();

  const topGainers = [...cryptoData].sort((a, b) => b.priceChange24h - a.priceChange24h).slice(0, 5);
  const topPatterns = [...cryptoData].sort((a, b) => b.analysis.confidence - a.analysis.confidence).slice(0, 5);
  const bullishCount = cryptoData.filter(c => c.analysis.trend === 'bullish').length;
  const bearishCount = cryptoData.filter(c => c.analysis.trend === 'bearish').length;
  const neutralCount = cryptoData.filter(c => c.analysis.trend === 'neutral').length;
  const highConfidence = cryptoData.filter(c => c.analysis.confidence >= 80).length;

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Total Market Cap</span>
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{formatNumber(marketStats.totalMarketCap)}</p>
          <p className="text-sm text-green-400 mt-1">+2.4% today</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">24h Volume</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{formatNumber(marketStats.totalVolume24h)}</p>
          <p className="text-sm text-text-secondary mt-1">BTC: {formatNumber(marketStats.totalVolume24h * 0.4)}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Patterns Detected</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{marketStats.patternsDetected} <span className="text-sm text-text-muted">/ {marketStats.scanningPairs}</span></p>
          <p className="text-sm text-text-secondary mt-1">Scanning active</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">BTC Dominance</span>
            <ArrowUpRight className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{marketStats.btcDominance}%</p>
          <p className="text-sm text-red-400 mt-1">-0.3% today</p>
        </div>
      </div>

      {/* Trend Distribution */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Market Trend Distribution</h3>
          <button onClick={refreshData} className="text-xs text-accent hover:text-accent-hover">Refresh</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-400">{bullishCount}</p>
            <p className="text-sm text-green-300/70 mt-1">Bullish</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
            <Activity className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-400">{neutralCount}</p>
            <p className="text-sm text-yellow-300/70 mt-1">Neutral</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <TrendingDown className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-400">{bearishCount}</p>
            <p className="text-sm text-red-300/70 mt-1">Bearish</p>
          </div>
        </div>
      </div>

      {/* High Confidence Alerts */}
      {highConfidence > 0 && (
        <div className="bg-gradient-to-r from-accent/10 via-purple-500/10 to-blue-500/10 border border-accent/30 rounded-xl p-5 animate-pulse-glow">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-text-primary">High Confidence Setups ({highConfidence})</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {cryptoData.filter(c => c.analysis.confidence >= 80).map((asset) => (
              <div key={asset.id} className="bg-bg-card/80 rounded-lg p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text-primary">{asset.symbol}</span>
                  <span className="text-xs text-accent font-medium">{asset.analysis.confidence}%</span>
                </div>
                <div className="text-xs text-text-muted mb-1">{getPatternLabel(asset.analysis.pattern)}</div>
                <div className="text-xs text-text-secondary">
                  Current: Wave {asset.analysis.currentWave} → {String(asset.analysis.nextExpectedWave)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Chart */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {cryptoData[0]?.name} ({cryptoData[0]?.symbol})
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">{formatPrice(cryptoData[0]?.price)}</span>
              <span className={`text-sm font-medium ${cryptoData[0]?.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {cryptoData[0]?.priceChange24h >= 0 ? '+' : ''}{cryptoData[0]?.priceChange24h}%
              </span>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: getPatternColor(cryptoData[0]?.analysis.pattern) + '20', color: getPatternColor(cryptoData[0]?.analysis.pattern) }}
          >
            {getPatternLabel(cryptoData[0]?.analysis.pattern)}
          </div>
        </div>
        <WaveChart asset={cryptoData[0]!} height={400} />
      </div>

      {/* Crypto Table */}
      <CryptoTable />

      {/* Top Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top Gainers
          </h3>
          <div className="space-y-3">
            {topGainers.map((asset, i) => (
              <div key={asset.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm w-5">{i + 1}</span>
                  <div>
                    <p className="text-text-primary font-medium text-sm">{asset.name}</p>
                    <p className="text-text-muted text-xs">{asset.symbol}/USDT</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary text-sm font-medium">{formatPrice(asset.price)}</p>
                  <p className={`text-xs font-medium ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Highest Confidence Patterns
          </h3>
          <div className="space-y-3">
            {topPatterns.map((asset, i) => (
              <div key={asset.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm w-5">{i + 1}</span>
                  <div>
                    <p className="text-text-primary font-medium text-sm">{asset.name}</p>
                    <p className="text-text-muted text-xs">Wave {asset.analysis.currentWave} → {String(asset.analysis.nextExpectedWave)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: getPatternColor(asset.analysis.pattern) + '20', color: getPatternColor(asset.analysis.pattern) }}
                  >
                    {getPatternLabel(asset.analysis.pattern)}
                  </div>
                  <p className="text-accent text-xs font-medium mt-1">{asset.analysis.confidence}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
