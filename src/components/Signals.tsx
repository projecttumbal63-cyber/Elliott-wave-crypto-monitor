import { useAppContext } from '../context/AppContext';
import { TrendingUp, TrendingDown, Eye, Check, AlertTriangle, Bell, Filter, Clock } from 'lucide-react';
import { formatPrice, getPatternLabel, getPatternColor } from '../data/cryptoData';

export function Signals() {
  const { cryptoData, setCurrentPage, setSelectedCrypto } = useAppContext();

  const allSignals = cryptoData.flatMap(asset =>
    asset.signals.map(signal => ({
      ...signal,
      asset,
    }))
  ).sort((a, b) => {
    const order = { buy: 0, sell: 1, watch: 2 };
    return (order[a.type] ?? 3) - (order[b.type] ?? 3);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bell className="w-6 h-6 text-accent" />
            Trading Signals
          </h2>
          <p className="text-text-secondary text-sm mt-1">Elliott Wave based trading signals from pattern analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-muted">{allSignals.length} active signals</span>
        </div>
      </div>

      {/* Signal Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">
          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-400">{allSignals.filter(s => s.type === 'buy').length}</p>
          <p className="text-sm text-green-300/70">Buy Signals</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-red-400">{allSignals.filter(s => s.type === 'sell').length}</p>
          <p className="text-sm text-red-300/70">Sell Signals</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 text-center">
          <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-yellow-400">{allSignals.filter(s => s.type === 'watch').length}</p>
          <p className="text-sm text-yellow-300/70">Watch Signals</p>
        </div>
      </div>

      {/* Signal Cards */}
      <div className="space-y-3">
        {allSignals.map((signal, idx) => {
          const signalColor = signal.type === 'buy' ? 'green' : signal.type === 'sell' ? 'red' : 'yellow';
          const patternColor = getPatternColor(signal.asset.analysis.pattern);

          return (
            <div
              key={idx}
              className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-all cursor-pointer"
              onClick={() => {
                setSelectedCrypto(signal.asset.id);
                setCurrentPage('analysis');
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Signal Type Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    signal.type === 'buy' ? 'bg-green-500/20' :
                    signal.type === 'sell' ? 'bg-red-500/20' :
                    'bg-yellow-500/20'
                  }`}>
                    {signal.type === 'buy' ? (
                      <TrendingUp className={`w-5 h-5 text-${signalColor}-400`} />
                    ) : signal.type === 'sell' ? (
                      <TrendingDown className={`w-5 h-5 text-${signalColor}-400`} />
                    ) : (
                      <Eye className={`w-5 h-5 text-${signalColor}-400`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        signal.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                        signal.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {signal.type}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        signal.strength === 'strong' ? 'bg-green-500/20 text-green-400' :
                        signal.strength === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {signal.strength}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-bold text-text-primary">{signal.asset.name}</span>
                      <span className="text-text-secondary">{formatPrice(signal.asset.price)}</span>
                      <span className="text-xs text-text-muted">•</span>
                      <div
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{ backgroundColor: patternColor + '20', color: patternColor }}
                      >
                        {getPatternLabel(signal.asset.analysis.pattern)}
                      </div>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">Wave {signal.asset.analysis.currentWave} → {String(signal.asset.analysis.nextExpectedWave)}</span>
                    </div>

                    <p className="text-sm text-text-secondary mt-2">{signal.message}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <Clock className="w-3 h-3" />
                    <span>Just now</span>
                  </div>
                  <div className="text-xs font-medium" style={{ color: patternColor }}>
                    {signal.asset.analysis.confidence}% match
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
