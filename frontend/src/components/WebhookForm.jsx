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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Form Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Interval</label>
          <input
            type="text"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">RSI Periyodu</label>
          <select
            value={rsiPeriod}
            onChange={(e) => setRsiPeriod(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={9}>9</option>
            <option value={14}>14 (Standart)</option>
            <option value={21}>21</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Candles (JSON)</label>
          <textarea
            value={candles}
            onChange={(e) => setCandles(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded font-mono"
            placeholder='[
{ "open": 100, "high": 110, "low": 90, "close": 105, "volume": 1500 },
{ "open": 105, "high": 115, "low": 100, "close": 110, "volume": 1600 }
]'
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        disabled={loading}
      >
        {loading ? "Analiz Ediliyor..." : "Analiz Et"}
      </button>

      {/* Sonuç Alanı */}
      {result && result.analysis && (
        <div className="bg-gray-100 p-6 rounded mt-8">
          <h3 className="text-xl font-bold mb-4">📊 Analiz Raporu</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Her Özellik Kartı */}
            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">Ortalama Kapanış</p>
              <p>{result.analysis.average_close}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">Ortalama Hacim</p>
              <p>{result.analysis.average_volume}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">En Yüksek Fiyat</p>
              <p>{result.analysis.highest_price}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">En Düşük Fiyat</p>
              <p>{result.analysis.lowest_price}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">Trend Yönü</p>
              <p>{result.analysis.trend_direction}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">Trend Gücü (%)</p>
              <p>{result.analysis.trend_strength_percent}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">RSI Değeri</p>
              <p>{result.analysis.rsi_value}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">EMA (14)</p>
              <p>{result.analysis.ema_value}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">MACD</p>
              <p>{result.analysis.macd_value}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">Stochastic %K</p>
              <p>{result.analysis.stochastic_value}</p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <p className="font-semibold">ADX Değeri</p>
              <p>{result.analysis.adx_value}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
