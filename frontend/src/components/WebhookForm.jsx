import React, { useState } from "react";

export default function WebhookForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [candles, setCandles] = useState("");
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
          rsi_period: 14, // İstersen burada açılır menü ekleriz (şimdilik sabit 14)
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Hata:", error);
    }
    setLoading(false);
  };

  const renderTradeSuggestion = (trendDirection) => {
    if (trendDirection === "Uptrend") return "Trend yukarı, alım fırsatı olabilir.";
    if (trendDirection === "Downtrend") return "Trend aşağı, dikkatli olunmalı.";
    return "Yatay piyasa, hacim düşük olabilir.";
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Interval</label>
        <input
          type="text"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Candles (JSON)</label>
        <textarea
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
          rows={8}
          className="w-full p-2 border rounded font-mono"
          placeholder='[
{ "open": 100, "high": 110, "low": 90, "close": 105, "volume": 1500 },
{ "open": 105, "high": 115, "low": 100, "close": 110, "volume": 1600 }
]'
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Analiz Ediliyor..." : "Analiz Et"}
      </button>

      {result && (
        <div className="bg-gray-100 p-6 rounded mt-8">
          <h3 className="text-lg font-bold flex items-center gap-2">📄 Analiz Raporu</h3>
          <p><b>Symbol:</b> {result.symbol}</p>
          <p><b>Interval:</b> {result.interval}</p>
          <p><b>Veri Sayısı:</b> {result.candles_count}</p>
          <hr className="my-2" />
          <p><b>Ortalama Kapanış:</b> {result.average_close}</p>
          <p><b>Ortalama Hacim:</b> {result.average_volume}</p>
          <p><b>En Yüksek Fiyat:</b> {result.highest_price}</p>
          <p><b>En Düşük Fiyat:</b> {result.lowest_price}</p>
          <p className="flex items-center gap-1">📈 <b>Trend Yönü:</b> {result.trend_direction}</p>
          <p className="flex items-center gap-1">📉 <b>Trend Gücü:</b> {result.trend_strength_percent} %</p>
          <hr className="my-2" />
          <p className="flex items-center gap-1">📊 <b>RSI Değeri:</b> {result.rsi_value}</p>
          <p className="flex items-center gap-1">🛠️ <b>RSI Periyodu:</b> {result.rsi_period}</p>
          <p className="mt-2 font-semibold">💬 <b>Trade Önerisi:</b> {renderTradeSuggestion(result.trend_direction)}</p>
        </div>
      )}
    </div>
  );
}
