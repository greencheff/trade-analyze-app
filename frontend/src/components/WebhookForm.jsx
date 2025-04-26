import React, { useState } from "react";
import axios from "axios";

function WebhookForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [candles, setCandles] = useState(`[
    { "open": 100, "high": 110, "low": 90, "close": 105, "volume": 1500 },
    { "open": 105, "high": 115, "low": 100, "close": 110, "volume": 1600 },
    { "open": 110, "high": 120, "low": 105, "close": 115, "volume": 1700 },
    { "open": 115, "high": 125, "low": 110, "close": 120, "volume": 1800 }
  ]`);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/analyze", {
        symbol,
        interval,
        rsi_period: rsiPeriod,
        candles: JSON.parse(candles),
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error("Hata oluştu:", error);
      alert("Analiz yapılırken bir hata oluştu. Lütfen verileri kontrol edin.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">📊 Trade Analiz Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={rsiPeriod}
          onChange={(e) => setRsiPeriod(Number(e.target.value))}
        >
          <option value={14}>RSI Period: 14 (Standart)</option>
          <option value={7}>RSI Period: 7</option>
          <option value={21}>RSI Period: 21</option>
        </select>
        <textarea
          className="border p-2 rounded h-40"
          placeholder="Candles JSON"
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-6"
        onClick={handleSubmit}
      >
        Analiz Et
      </button>

      {analysisResult && (
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-4">🔎 Özet Analiz</h2>
            <p><strong>Symbol:</strong> {analysisResult.symbol}</p>
            <p><strong>Interval:</strong> {analysisResult.interval}</p>
            <p><strong>Veri Sayısı:</strong> {analysisResult.candles_count}</p>
            <p><strong>Ortalama Kapanış:</strong> {analysisResult.analysis.average_close}</p>
            <p><strong>Ortalama Hacim:</strong> {analysisResult.analysis.average_volume}</p>
            <p><strong>En Yüksek Fiyat:</strong> {analysisResult.analysis.highest_price}</p>
            <p><strong>En Düşük Fiyat:</strong> {analysisResult.analysis.lowest_price}</p>
            <p><strong>Trend Yönü:</strong> {analysisResult.analysis.trend_direction}</p>
            <p><strong>Trend Gücü (%):</strong> {analysisResult.analysis.trend_strength_percent}</p>
          </div>

          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-4">⚡ İleri Düzey Analiz</h2>
            <p><strong>RSI Değeri:</strong> {analysisResult.analysis.rsi_value}</p>
            <p><strong>EMA (14):</strong> {analysisResult.analysis.ema_value}</p>
            <p><strong>MACD:</strong> {analysisResult.analysis.macd_value}</p>
            <p><strong>Stochastic %K:</strong> {analysisResult.analysis.stochastic_k_value}</p>
            <p><strong>ADX Değeri:</strong> {analysisResult.analysis.adx_value}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebhookForm;
