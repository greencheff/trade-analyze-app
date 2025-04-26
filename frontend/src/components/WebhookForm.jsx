import React, { useState } from "react";

export default function WebhookForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [candles, setCandles] = useState("");
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://trade-analyze-backend.onrender.com/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          interval,
          candles: JSON.parse(candles),
          rsi_period: rsiPeriod,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Hata:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📊 Trade Analiz Dashboard</h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol (BTCUSDT)"
          className="p-3 border rounded shadow"
        />
        <input
          type="text"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          placeholder="Interval (1m, 1h...)"
          className="p-3 border rounded shadow"
        />
        <select
          value={rsiPeriod}
          onChange={(e) => setRsiPeriod(parseInt(e.target.value))}
          className="p-3 border rounded shadow"
        >
          <option value={9}>RSI Period: 9</option>
          <option value={14}>RSI Period: 14 (Standart)</option>
          <option value={21}>RSI Period: 21</option>
        </select>
        <textarea
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
          rows={5}
          className="p-3 border rounded shadow font-mono"
          placeholder='[
{ "open": 100, "high": 110, "low": 90, "close": 105, "volume": 1500 },
{ "open": 105, "high": 115, "low": 100, "close": 110, "volume": 1600 }
]'
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded shadow text-lg mb-8"
        disabled={loading}
      >
        {loading ? "Analiz Ediliyor..." : "Analiz Et"}
      </button>

      {/* Analiz Sonuçları */}
      {result && result.analysis && (
        <div className="space-y-8">

          {/* Özet Kart */}
          <div className="bg-gray-100 p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">🔎 Özet Analiz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Symbol</p>
                <p>{result.symbol}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Interval</p>
                <p>{result.interval}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Veri Sayısı</p>
                <p>{result.candles_count}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Ortalama Kapanış</p>
                <p>{result.analysis.average_close}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Ortalama Hacim</p>
                <p>{result.analysis.average_volume}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">En Yüksek Fiyat</p>
                <p>{result.analysis.highest_price}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">En Düşük Fiyat</p>
                <p>{result.analysis.lowest_price}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Trend Yönü</p>
                <p>{result.analysis.trend_direction}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Trend Gücü (%)</p>
                <p>{result.analysis.trend_strength_percent}</p>
              </div>
            </div>
          </div>

          {/* İleri Düzey Teknik Kartlar */}
          <div className="bg-gray-100 p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">⚡ İleri Düzey Analiz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">RSI Değeri</p>
                <p>{result.analysis.rsi_value}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">EMA (14)</p>
                <p>{result.analysis.ema_value}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">MACD</p>
                <p>{result.analysis.macd_value}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">Stochastic %K</p>
                <p>{result.analysis.stochastic_value}</p>
              </div>
              <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                <p className="font-semibold">ADX Değeri</p>
                <p>{result.analysis.adx_value}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
