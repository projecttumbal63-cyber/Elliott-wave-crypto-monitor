import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Target, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Eye, Zap, BarChart3, Layers } from 'lucide-react';
import { WaveChart } from './WaveChart';
import { formatPrice, getPatternLabel, getPatternColor, formatNumber } from '../data/cryptoData';

export function Analysis() {
  const { cryptoData, selectedCrypto, setCurrentPage, setSelectedCrypto } = useAppContext();
  const [showFib, setShowFib] = useState(false);

  const asset = cryptoData.find(c => c.id === selectedCrypto) || cryptoData[0];
  if (!asset) return <div className="p-8 text-text-muted">No data available</div>;

  const analysis = asset.analysis;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setSelectedCrypto(null); setCurrentPage('dashboard'); }}
          className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Asset Header */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{asset.name} ({asset.symbol})</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">{formatPrice(asset.price)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${asset.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted">MCap: {formatNumber(asset.marketCap)}</span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted">Vol: {formatNumber(asset.volume24h)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: getPatternColor(analysis.pattern) + '20', color: getPatternColor(analysis.pattern) }}
            >
              {getPatternLabel(analysis.pattern)}
            </div>
            <div className="text-center">
              <div className="text-xs text-text-muted">Confidence</div>
              <div className="text-lg font-bold" style={{ color: analysis.confidence >= 80 ? '#10b981' : analysis.confidence >= 65 ? '#f59e0b' : '#ef4444' }}>
                {analysis.confidence}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <WaveChart asset={asset} height={450} showWaves={true} />
      </div>

      {/* Wave Analysis Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wave Structure */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            Wave Structure
          </h3>
          <div className="space-y-3">
            {analysis.wavePoints.map((wp) => (
              <div key={String(wp.waveNumber)} className="flex items-center justify-between bg-bg-primary/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${wp.isConfirmed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400 animate-pulse'}`}>
                    {wp.waveNumber}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary font-medium">Wave {wp.waveNumber}</p>
                    <p className="text-xs text-text-muted">{wp.isConfirmed ? 'Confirmed' : 'Forming...'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">{formatPrice(wp.price)}</p>
                  {wp.fibonacciLevel && <p className="text-xs text-yellow-400">Fib {wp.fibonacciLevel}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Plan */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Trading Plan
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-300/70">Target Price</span>
                </div>
                <p className="text-xl font-bold text-green-400">{formatPrice(analysis.targetPrice)}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-300/70">Stop Loss</span>
                </div>
                <p className="text-xl font-bold text-red-400">{formatPrice(analysis.stopLoss)}</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-300/70">Invalidation Level</span>
              </div>
              <p className="text-xl font-bold text-yellow-400">{formatPrice(analysis.invalidationLevel)}</p>
              <p className="text-xs text-text-muted mt-1">If price breaks this level, the count is invalid</p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-300/70">Next Expected Wave</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-bold text-blue-400">Wave {String(analysis.nextExpectedWave)}</p>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <ArrowProgress current={analysis.currentWave} next={analysis.nextExpectedWave} />
                </div>
              </div>
            </div>

            {/* Completion Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Pattern Completion</span>
                <span className="text-sm font-bold text-accent">{analysis.completion.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-bg-primary rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                  style={{ width: `${analysis.completion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fibonacci Levels */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <button
          onClick={() => setShowFib(!showFib)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-500" />
            Fibonacci Levels
          </h3>
          {showFib ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </button>
        {showFib && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '0.236 Retrace', value: analysis.fibonacciLevels.retracement236 },
              { label: '0.382 Retrace', value: analysis.fibonacciLevels.retracement382 },
              { label: '0.500 Retrace', value: analysis.fibonacciLevels.retracement500 },
              { label: '0.618 Retrace', value: analysis.fibonacciLevels.retracement618 },
              { label: '0.786 Retrace', value: analysis.fibonacciLevels.retracement786 },
              { label: '1.618 Extension', value: analysis.fibonacciLevels.extension1618 },
              { label: '2.618 Extension', value: analysis.fibonacciLevels.extension2618 },
            ].map((level) => (
              <div key={level.label} className="bg-bg-primary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-text-muted mb-1">{level.label}</p>
                <p className="text-sm font-bold text-text-primary">{formatPrice(level.value)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signals */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          Active Signals
        </h3>
        <div className="space-y-3">
          {asset.signals.map((signal, i) => (
            <div key={i} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                signal.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                signal.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {signal.type === 'buy' ? <TrendingUp className="w-4 h-4" /> : signal.type === 'sell' ? <TrendingDown className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    signal.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                    signal.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {signal.type.toUpperCase()}
                  </span>
                  <span className={`text-xs font-medium ${
                    signal.strength === 'strong' ? 'text-green-400' :
                    signal.strength === 'moderate' ? 'text-yellow-400' :
                    'text-text-muted'
                  }`}>
                    {signal.strength}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{signal.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowProgress({ current, next }: { current: number | string; next: number | string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-accent">{String(current)}</span>
      <span>→</span>
      <span className="text-yellow-400">{String(next)}</span>
    </span>
  );
}
