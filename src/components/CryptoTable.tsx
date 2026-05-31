import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronUp, ChevronDown, Search, Filter, ArrowRight } from 'lucide-react';
import { formatPrice, formatNumber, getPatternLabel, getPatternColor } from '../data/cryptoData';
import { WavePattern } from '../types';

export function CryptoTable() {
  const { cryptoData, setCurrentPage, setSelectedCrypto } = useAppContext();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterPattern, setFilterPattern] = useState<WavePattern | 'all'>('all');
  const [filterTrend, setFilterTrend] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  let filtered = cryptoData.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.symbol.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPattern !== 'all' && c.analysis.pattern !== filterPattern) return false;
    if (filterTrend !== 'all' && c.analysis.trend !== filterTrend) return false;
    return true;
  });

  filtered.sort((a, b) => {
    let aVal: any, bVal: any;
    switch (sortField) {
      case 'name': aVal = a.name; bVal = b.name; break;
      case 'price': aVal = a.price; bVal = b.price; break;
      case 'change': aVal = a.priceChange24h; bVal = b.priceChange24h; break;
      case 'marketCap': aVal = a.marketCap; bVal = b.marketCap; break;
      case 'confidence': aVal = a.analysis.confidence; bVal = b.analysis.confidence; break;
      case 'pattern': aVal = a.analysis.pattern; bVal = b.analysis.pattern; break;
      default: aVal = a.rank; bVal = b.rank; break;
    }
    if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const patterns: WavePattern[] = ['impulse', 'corrective-abc', 'diagonal', 'triangle', 'extended-3rd', 'running-flat', 'zigzag'];

  const SortIcon = ({ field }: { field: string }) => (
    <span className="ml-1">
      {sortField === field ? (
        sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />
      ) : (
        <ChevronDown className="w-3 h-3 inline opacity-30" />
      )}
    </span>
  );

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
              value={filterPattern}
              onChange={e => setFilterPattern(e.target.value as WavePattern | 'all')}
              className="bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Patterns</option>
              {patterns.map(p => <option key={p} value={p}>{getPatternLabel(p)}</option>)}
            </select>
            <select
              value={filterTrend}
              onChange={e => setFilterTrend(e.target.value as any)}
              className="bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All Trends</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="px-4 py-3 text-left font-medium cursor-pointer hover:text-text-primary" onClick={() => handleSort('rank')}>#<SortIcon field="rank" /></th>
              <th className="px-4 py-3 text-left font-medium cursor-pointer hover:text-text-primary" onClick={() => handleSort('name')}>Asset<SortIcon field="name" /></th>
              <th className="px-4 py-3 text-right font-medium cursor-pointer hover:text-text-primary" onClick={() => handleSort('price')}>Price<SortIcon field="price" /></th>
              <th className="px-4 py-3 text-right font-medium cursor-pointer hover:text-text-primary" onClick={() => handleSort('change')}>24h %<SortIcon field="change" /></th>
              <th className="px-4 py-3 text-right font-medium cursor-pointer hover:text-text-primary" onClick={() => handleSort('marketCap')}>Market Cap<SortIcon field="marketCap" /></th>
              <th className="px-4 py-3 text-left font-medium cursor-pointer hover:text-text-primary" onClick={() => handleSort('pattern')}>Pattern<SortIcon field="pattern" /></th>
              <th className="px-4 py-3 text-left font-medium">Wave</th>
              <th className="px-4 py-3 text-center font-medium">Confidence</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr key={asset.id} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                <td className="px-4 py-3 text-text-muted">{asset.rank}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-text-primary">{asset.name}</p>
                    <p className="text-xs text-text-muted">{asset.symbol}/USDT</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-text-primary">{formatPrice(asset.price)}</td>
                <td className={`px-4 py-3 text-right font-medium ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-right text-text-secondary">{formatNumber(asset.marketCap)}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap inline-block"
                    style={{ backgroundColor: getPatternColor(asset.analysis.pattern) + '20', color: getPatternColor(asset.analysis.pattern) }}
                  >
                    {getPatternLabel(asset.analysis.pattern)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-accent font-medium">Wave {asset.analysis.currentWave}</span>
                    <ArrowRight className="w-3 h-3 text-text-muted" />
                    <span className="text-yellow-400">{String(asset.analysis.nextExpectedWave)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-bg-primary rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${asset.analysis.completion}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-1">
                    <div className="w-8 h-8 relative">
                      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#1f2b42"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={asset.analysis.confidence >= 80 ? '#10b981' : asset.analysis.confidence >= 65 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="3"
                          strokeDasharray={`${asset.analysis.confidence}, 100`}
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-text-primary ml-1">{asset.analysis.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedCrypto(asset.id);
                      setCurrentPage('analysis');
                    }}
                    className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-text-muted">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No assets match your filters</p>
        </div>
      )}
    </div>
  );
}
