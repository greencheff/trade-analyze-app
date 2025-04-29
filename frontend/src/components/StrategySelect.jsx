import React from 'react';

const strategies = [
  { value: 'breakout_volume', label: 'Breakout + Hacim Onayı' },
  { value: 'mtf_confirmation', label: 'Multi Timeframe Trend Onayı' },
  { value: 'rsi_divergence', label: 'RSI Diverjans' },
  { value: 'bollinger_breakout', label: 'Bollinger Bandı Sıkışması' },
  { value: 'orderblock_rsi_divergence', label: 'Order Block + RSI Diverjans' },
  { value: 'ema_ribbon_trend', label: 'EMA Ribbon Trend Sistemi' },
  { value: 'stochastic_rsi_momentum', label: 'Stochastic RSI Momentum Dönüşü' },
  { value: 'keltner_channel_breakout', label: 'Keltner Channel Breakout' },
  { value: 'pivot_point_strategy', label: 'Pivot Noktası Stratejisi' },
  { value: 'liquidity_sweep_bos', label: 'Liquidity Sweep + BOS' }
];

export default function StrategySelect({ selectedStrategy, setSelectedStrategy }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="strategy-select" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
        Strateji Seçimi
      </label>
      <select
        id="strategy-select"
        value={selectedStrategy}
        onChange={(e) => setSelectedStrategy(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Bir strateji seçiniz</option>
        {strategies.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
