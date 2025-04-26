import React, { useState } from "react";
import axios from "axios";

function WebhookForm() {
  const [symbol, setSymbol] = useState("");
  const [interval, setInterval] = useState("");
  const [candles, setCandles] = useState("");
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const parsedCandles = JSON.parse(candles);
      const response = await axios.post("https://trade-analyze-backend.onrender.com/api/analyze", {
        symbol,
        interval,
        rsi_period: rsiPeriod,
        candles: parsedCandles,
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error("Analyze error:", error);
      setAnalysisResult({ error: "Sunucu hatası veya yanlış veri formatı" });
    }
  };

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📈 Trade Analiz Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Symbol (örnek: BTCUSDT)"
          className="border rounded p-2"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="text"
          placeholder="Interval (örnek: 1m, 5m, 1h)"
          className="border rounded p-2"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          className="border rounded p-2"
          value={rsiPeriod}
          onChange={(e) => setRsiPeriod(parseInt(e.target.value))}
        >
          <option value={14}>RSI Period: 14 (Standart)</option>
          <option value={7}>RSI Period: 7</option>
          <option value={21}>RSI Period: 21</option>
        </select>

        <textarea
          placeholder="Candles JSON"
          className="border rounded p-2 h-32"
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Analiz Et
      </button>

      {analysisResult && analysisResult.status === "ok" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-2">🔎 Özet Analiz</h2>
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
            <h2 className="text-xl font-bold mb-2">⚡ İleri Düzey Analiz</h2>
            <p><strong>RSI Değeri:</strong> {analysisResult.analysis.rsi_value}</p>
            <p><strong>EMA (14):</strong> {analysisResult.analysis.ema_value}</p>
            <p><strong>MACD:</strong> {analysisResult.analysis.macd_value}</p>
            <p><strong>Stochastic %K:</strong> {analysisResult.analysis.stochastic_k_value}</p>
            <p><strong>ADX Değeri:</strong> {analysisResult.analysis.adx_value}</p>
          </div>
        </div>
      )}

      {analysisResult && analysisResult.error && (
        <div className="text-red-600 font-bold">{analysisResult.error}</div>
      )}
    </div>
  );
}

export default WebhookForm;
