import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ScanLine, Check, AlertTriangle, Clock, Loader2, ArrowRight } from 'lucide-react';
import { getPatternLabel, getPatternColor, formatPrice } from '../data/cryptoData';
import { WavePattern } from '../types';

export function Scanner() {
  const { cryptoData, setCurrentPage, setSelectedCrypto } = useAppContext();
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<typeof cryptoData>([]);

  useEffect(() => {
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          setScanning(false);
          setScanResults([...cryptoData].sort((a, b) => b.analysis.confidence - a.analysis.confidence));
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [cryptoData]);

  const patternCounts: Record<WavePattern, number> = {} as any;
  cryptoData.forEach(c => {
    patternCounts[c.analysis.pattern] = (patternCounts[c.analysis.pattern] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-accent" />
            Elliott Wave Scanner
          </h2>
          <p className="text-text-secondary text-sm mt-1">Scanning crypto markets for Elliott Wave patterns in real-time</p>
        </div>
        <div className="text-sm text-text-muted">
          {scanning ? `Scanning... ${scanProgress}%` : `Scan complete — ${cryptoData.length} pairs analyzed`}
        </div>
      </div>

      {/* Scanning Progress */}
      {scanning && (
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
            <span className="text-text-primary font-medium">Analyzing market patterns...</span>
          </div>
          <div className="w-full bg-bg-primary rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-100"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted">
            <span>{Math.floor(scanProgress * cryptoData.length / 100)} / {cryptoData.length} pairs scanned</span>
            <span>{scanProgress}%</span>
          </div>
        </div>
      )}

      {/* Pattern Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {(Object.keys(patternCounts) as WavePattern[]).map((pattern) => (
          <div key={pattern} className="bg-bg-card border border-border rounded-lg p-4 text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: getPatternColor(pattern) }}
            />
            <p className="text-xs text-text-muted mb-1">{getPatternLabel(pattern)}</p>
            <p className="text-xl font-bold text-text-primary">{patternCounts[pattern]}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      {!scanning && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Scan Results — Ranked by Confidence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scanResults.map((asset) => (
              <div
                key={asset.id}
                className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedCrypto(asset.id);
                  setCurrentPage('analysis');
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-text-primary">{asset.symbol}</span>
                      <span className="text-xs text-text-muted">/USDT</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-medium">{formatPrice(asset.price)}</span>
                      <span className={`text-xs ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: getPatternColor(asset.analysis.pattern) + '20', color: getPatternColor(asset.analysis.pattern) }}
                  >
                    {getPatternLabel(asset.analysis.pattern)}
                  </div>
                </div>

                {/* Wave Info */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-bg-primary/50 rounded-lg p-2.5">
                    <p className="text-xs text-text-muted mb-0.5">Current Wave</p>
                    <p className="text-sm font-bold text-accent">Wave {asset.analysis.currentWave}</p>
                  </div>
                  <div className="bg-bg-primary/50 rounded-lg p-2.5">
                    <p className="text-xs text-text-muted mb-0.5">Next Expected</p>
                    <p className="text-sm font-bold text-yellow-400">Wave {String(asset.analysis.nextExpectedWave)}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-bg-primary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${asset.analysis.confidence}%`,
                        backgroundColor: asset.analysis.confidence >= 80 ? '#10b981' : asset.analysis.confidence >= 65 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text-primary w-10 text-right">{asset.analysis.confidence}%</span>
                </div>

                {/* Signals */}
                <div className="space-y-1.5">
                  {asset.signals.slice(0, 2).map((signal, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      {signal.type === 'buy' ? (
                        <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : signal.type === 'sell' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-text-secondary leading-tight">{signal.message}</span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted group-hover:text-accent transition-colors">
                  <span>View full analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wave Pattern Guide */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Pattern Reference Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-primary/50 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-2">Impulse Patterns (Bullish)</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• <strong>5-Wave Impulse:</strong> Motive wave in direction of trend (1-2-3-4-5)</li>
              <li>• <strong>Extended Wave 3:</strong> Wave 3 is longest, most powerful</li>
              <li>• <strong>Leading Diagonal:</strong> Wedge-shaped Wave 1 or A</li>
            </ul>
          </div>
          <div className="bg-bg-primary/50 rounded-lg p-4">
            <h4 className="text-red-400 font-medium mb-2">Corrective Patterns (Bearish)</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• <strong>A-B-C Corrective:</strong> Standard 3-wave correction</li>
              <li>• <strong>Zigzag (5-3-5):</strong> Sharp correction against trend</li>
              <li>• <strong>Running Flat:</strong> B wave exceeds A wave start</li>
              <li>• <strong>Triangle:</strong> Converging pattern (A-B-C-D-E)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
