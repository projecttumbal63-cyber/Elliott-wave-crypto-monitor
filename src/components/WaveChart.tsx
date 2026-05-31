import { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import type { CryptoAsset } from '../types';
import { getPatternColor, formatPrice } from '../data/cryptoData';

interface WaveChartProps {
  asset: CryptoAsset;
  height?: number;
  showWaves?: boolean;
}

export function WaveChart({ asset, height = 350, showWaves = true }: WaveChartProps) {
  const chartData = useMemo(() => {
    return asset.priceHistory.map((candle) => {
      const date = new Date(candle.time);
      return {
        time: candle.time,
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        close: candle.close,
        high: candle.high,
        low: candle.low,
        open: candle.open,
        volume: candle.volume,
      };
    });
  }, [asset.priceHistory]);

  const wavePoints = useMemo(() => {
    return asset.analysis.wavePoints.map(wp => {
      const idx = Math.floor((wp.timestamp - asset.priceHistory[0]?.time) / 86400000);
      return {
        ...wp,
        x: Math.max(0, Math.min(idx, chartData.length - 1)),
      };
    });
  }, [asset.analysis.wavePoints, chartData, asset.priceHistory]);

  const wavePatternColor = getPatternColor(asset.analysis.pattern);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-card border border-border rounded-lg p-3 text-xs shadow-xl">
          <p className="text-text-muted mb-1">{data.date}</p>
          <p className="text-text-primary font-semibold">{formatPrice(data.close)}</p>
          <p className="text-green-400">H: {formatPrice(data.high)}</p>
          <p className="text-red-400">L: {formatPrice(data.low)}</p>
          <p className="text-text-secondary">Vol: {(data.volume / 1e6).toFixed(2)}M</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-secondary">{asset.symbol}/USDT</span>
          <span className="text-xs px-2 py-0.5 rounded bg-bg-hover text-text-muted">{asset.timeframe}</span>
          <span
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{ backgroundColor: wavePatternColor + '20', color: wavePatternColor }}
          >
            {asset.analysis.pattern.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={asset.priceChange24h >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
              <stop offset="100%" stopColor={asset.priceChange24h >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2b42" />
          <XAxis
            dataKey="date"
            stroke="#374151"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
          />
          <YAxis
            stroke="#374151"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => formatPrice(v)}
          />
          <Tooltip content={<CustomTooltip />} />

          {showWaves && wavePoints.length > 0 && (
            <>
              {asset.analysis.fibonacciLevels && (
                <>
                  <ReferenceLine
                    y={asset.analysis.fibonacciLevels.retracement618}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                    label={{ value: '0.618', position: 'right', fill: '#f59e0b', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={asset.analysis.fibonacciLevels.retracement382}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                    label={{ value: '0.382', position: 'right', fill: '#f59e0b', fontSize: 10 }}
                  />
                </>
              )}
            </>
          )}

          <Area
            type="monotone"
            dataKey="close"
            stroke={asset.priceChange24h >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Wave Points Display */}
      {showWaves && wavePoints.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {wavePoints.map((wp) => (
            <div
              key={String(wp.waveNumber)}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-bg-card border border-border"
            >
              <span className="font-bold" style={{ color: wp.isConfirmed ? '#10b981' : '#f59e0b' }}>
                Wave {wp.waveNumber}
              </span>
              <span className="text-text-secondary">{formatPrice(wp.price)}</span>
              {wp.fibonacciLevel && (
                <span className="text-yellow-500/70">{wp.fibonacciLevel}</span>
              )}
              {wp.isConfirmed ? (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
