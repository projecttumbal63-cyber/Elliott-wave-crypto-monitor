import { useState } from 'react';
import { Settings, Bell, Palette, Shield, Database, Globe, RefreshCw, Check } from 'lucide-react';

export function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" />
          Settings
        </h2>
        <p className="text-text-secondary text-sm mt-1">Configure your Elliott Wave scanner preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            <ToggleSetting title="High Confidence Alerts" description="Notify when pattern confidence > 80%" defaultOn />
            <ToggleSetting title="Pattern Complete" description="Alert when Elliott Wave pattern completes" defaultOn />
            <ToggleSetting title="New Pattern Detected" description="Alert when new pattern forms" defaultOn />
            <ToggleSetting title="Invalidation Alert" description="Alert when wave count is invalidated" defaultOn />
            <ToggleSetting title="Price Target Hit" description="Alert when target price is reached" defaultOn />
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Display
          </h3>
          <div className="space-y-4">
            <ToggleSetting title="Show Fibonacci Levels" description="Display Fib retracement on charts" defaultOn />
            <ToggleSetting title="Show Wave Labels" description="Display wave numbers on charts" defaultOn />
            <ToggleSetting title="Show Volume" description="Display volume bars below charts" defaultOn />
            <ToggleSetting title="Animate Charts" description="Enable chart animations" defaultOn />
            <ToggleSetting title="Dark Mode" description="Use dark theme (always on)" defaultOn />
          </div>
        </div>

        {/* Scanner Settings */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-500" />
            Scanner
          </h3>
          <div className="space-y-4">
            <ToggleSetting title="Auto Refresh" description="Automatically refresh data" defaultOn />
            <ToggleSetting title="Scan Meme Coins" description="Include meme coins in scan" defaultOff />
            <ToggleSetting title="Scan Low Cap" description="Include coins below $100M market cap" defaultOff />
            <ToggleSetting title="Strict Pattern Match" description="Higher accuracy, fewer results" defaultOn />
            <ToggleSetting title="Sound Alerts" description="Play sound on new signals" defaultOff />
          </div>
        </div>

        {/* Risk Management */}
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Risk Management
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary">Default Stop Loss (%)</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full mt-1 bg-bg-primary border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary">Min Confidence for Alerts (%)</label>
              <input
                type="number"
                defaultValue={70}
                className="w-full mt-1 bg-bg-primary border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary">Preferred Timeframe</label>
              <select className="w-full mt-1 bg-bg-primary border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                <option>1H</option>
                <option>4H</option>
                <option selected>1D</option>
                <option>1W</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-accent text-white hover:bg-accent-hover'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Settings Saved
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* About */}
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          About EW Monitor
        </h3>
        <div className="text-sm text-text-secondary space-y-2">
          <p>EW Monitor is an Elliott Wave pattern scanner for cryptocurrency markets. It analyzes price action across multiple timeframes to identify classic Elliott Wave patterns including impulses, corrections, diagonals, and triangles.</p>
          <p className="text-text-muted text-xs mt-3">⚠️ Disclaimer: Elliott Wave analysis is subjective and should not be used as the sole basis for trading decisions. Always do your own research and manage your risk appropriately.</p>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ title, description, defaultOn, defaultOff }: { title: string; description: string; defaultOn?: boolean; defaultOff?: boolean }) {
  const [on, setOn] = useState(defaultOn && !defaultOff);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-accent' : 'bg-bg-primary border border-border'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} style={{ transform: on ? 'translateX(22px)' : 'translateX(0)' }} />
      </button>
    </div>
  );
}
