import React from 'react';

const strategies = [
  { value: 'breakout_volume', label: 'Breakout + Hacim Onayı (Sahte kırılımlardan kaçınır)' },
  { value: 'mtf_confirmation', label: 'Multi Timeframe Trend Onayı (Trend piyasasında işlem açar)' },
  { value: 'rsi_divergence', label: 'RSI Diverjans (Parabolik dönüşleri yakalar)' },
  { value: 'bollinger_breakout', label: 'Bollinger Bandı Sıkışması (Büyük patlamaları yakalar)' },
  { value: 'orderblock_rsi_divergence', label: 'Order Block + RSI Diverjans (Smart money izleme)' },
  { value: 'ema_ribbon', label: 'EMA Ribbon Trend Sistemi (Sağlam trendleri tespit eder)' },
  { value: 'stochastic_rsi_momentum', label: 'Stochastic RSI Momentum Dönüşü (Hızlı momentum değişimleri yakalar)' },
  { value: 'keltner_breakout', label: 'Keltner Channel Breakout (Volatilite çıkışlarını yakalar)' },
  { value: 'pivot_point', label: 'Pivot Noktası Stratejisi (Kısa vadeli güvenilir giriş-çıkış)' },
  { value: 'liquidity_sweep_bos', label: 'Liquidity Sweep + BOS (Smart money tuzaklarını izler)' },
];

export default function StrategySelect({ selectedStrategy, setSelectedStrategy }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        htmlFor="strategy-select"
        style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}
      >
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
  );
}
