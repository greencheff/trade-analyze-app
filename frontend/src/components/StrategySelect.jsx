import React from 'react';

const strategies = [
  { value: 'mtf_confirmation', label: 'Multi Timeframe Trend Onayı (MTF Confirmation)' },
  { value: 'orderblock_rsi_divergence', label: 'Order Block + RSI Diverjans Kombinasyonu' },
  { value: 'bollinger_breakout', label: 'Bollinger Bandı Sıkışması ve Patlama Stratejisi' },
  { value: 'rsi_divergence', label: 'RSI Diverjans (Uyumsuzluk) Stratejisi' },
  { value: 'breakout_volume', label: 'Breakout + Volume Onayı Stratejisi' }
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
        {strategies.map((strategy) => (
          <option key={strategy.value} value={strategy.value}>
            {strategy.label}
          </option>
        ))}
      </select>
    </div>
  );
}
