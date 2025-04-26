import React, { useState } from "react";

export default function WebhookForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [candles, setCandles] = useState(`[
    {"open":100,"high":110,"low":90,"close":105,"volume":1500},
    {"open":105,"high":115,"low":100,"close":110,"volume":1600}
  ]`);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const response = await fetch("https://trade-analyze-backend.onrender.com/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          interval,
          candles: JSON.parse(candles)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bilinmeyen bir hata oluştu.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderTradeSuggestion = (trendDirection) => {
    if (trendDirection === "Uptrend") {
      return "Alım için olumlu sinyaller mevcut.";
    } else if (trendDirection === "Downtrend") {
      return "Satış baskısı gözlemleniyor, dikkatli olunmalı.";
    } else {
      return "Piyasa kararsız, güçlü bir sinyal yok.";
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      <div className="space-y-4">
        <div>
          <label className="font-semibold">Symbol</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Interval</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Candles (JSON)</label>
          <textarea
            rows={8}
            className="w-full p-2 border rounded"
            value={candles}
            onChange={(e) => setCandles(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Analiz Et
        </button>

        {error && (
          <div className="text-red-500 font-semibold">Sunucu Hatası: {error}</div>
        )}

        {result && (
          <div className="bg-gray-100 p-4 rounded mt-4">
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
            <p className="mt-2 font-semibold">💬 <b>Trade Önerisi:</b> {renderTradeSuggestion(result.trend_direction)}</p>
          </div>
        )}

      </div>

    </div>
  );
}
