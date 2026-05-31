import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Star, StarOff, TrendingUp, TrendingDown, Eye, ArrowRight } from 'lucide-react';
import { formatPrice, getPatternLabel, getPatternColor } from '../data/cryptoData';

export function Watchlist() {
  const { cryptoData, setCurrentPage, setSelectedCrypto } = useAppContext();
  const [watchlist, setWatchlist] = useState<Set<string>>(
    new Set(cryptoData.slice(0, 5).map(c => c.id))
  );

  const toggleWatch = (id: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const watchlistAssets = cryptoData.filter(c => watchlist.has(c.id));
  const otherAssets = cryptoData.filter(c => !watchlist.has(c.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Watchlist
          </h2>
          <p className="text-text-secondary text-sm mt-1">Monitor your favorite crypto Elliott Wave patterns</p>
        </div>
        <span className="text-sm text-text-muted">{watchlist.size} assets tracked</span>
      </div>

      {/* Watchlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-text-muted mb-1">Bullish Assets</p>
          <p className="text-2xl font-bold text-green-400">{watchlistAssets.filter(a => a.analysis.trend === 'bullish').length}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-text-muted mb-1">Bearish Assets</p>
          <p className="text-2xl font-bold text-red-400">{watchlistAssets.filter(a => a.analysis.trend === 'bearish').length}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-text-muted mb-1">Avg Confidence</p>
          <p className="text-2xl font-bold text-accent">
            {watchlistAssets.length > 0 ? Math.round(watchlistAssets.reduce((s, a) => s + a.analysis.confidence, 0) / watchlistAssets.length) : 0}%
          </p>
        </div>
      </div>

      {/* Watchlist Assets */}
      {watchlistAssets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Your Watchlist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {watchlistAssets.map((asset) => (
              <div key={asset.id} className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleWatch(asset.id)} className="text-yellow-400 hover:text-yellow-300">
                      <Star className="w-5 h-5 fill-yellow-400" />
                    </button>
                    <div>
                      <p className="font-bold text-text-primary">{asset.symbol}</p>
                      <p className="text-xs text-text-muted">{asset.name}</p>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: getPatternColor(asset.analysis.pattern) + '20', color: getPatternColor(asset.analysis.pattern) }}
                  >
                    {getPatternLabel(asset.analysis.pattern)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold">{formatPrice(asset.price)}</span>
                  <span className={`text-sm font-medium ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-bg-primary/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-text-muted">Wave</p>
                    <p className="text-sm font-bold text-accent">{asset.analysis.currentWave}</p>
                  </div>
                  <div className="bg-bg-primary/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-text-muted">Next</p>
                    <p className="text-sm font-bold text-yellow-400">{String(asset.analysis.nextExpectedWave)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {asset.analysis.trend === 'bullish' ? <TrendingUp className="w-4 h-4 text-green-400" /> : asset.analysis.trend === 'bearish' ? <TrendingDown className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-yellow-400" />}
                    <span className="text-xs text-text-secondary capitalize">{asset.analysis.trend}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCrypto(asset.id);
                      setCurrentPage('analysis');
                    }}
                    className="text-xs text-accent hover:text-accent-hover flex items-center gap-1"
                  >
                    Analyze <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Assets */}
      {otherAssets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Other Assets</h3>
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {otherAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 hover:bg-bg-hover transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleWatch(asset.id)} className="text-text-muted hover:text-yellow-400">
                    <StarOff className="w-4 h-4" />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{asset.name} <span className="text-text-muted">{asset.symbol}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-primary">{formatPrice(asset.price)}</span>
                  <span className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                  </span>
                  <div
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: getPatternColor(asset.analysis.pattern) + '20', color: getPatternColor(asset.analysis.pattern) }}
                  >
                    {getPatternLabel(asset.analysis.pattern)}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCrypto(asset.id);
                      setCurrentPage('analysis');
                    }}
                    className="text-xs text-accent hover:text-accent-hover"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
