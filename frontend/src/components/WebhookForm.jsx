import React, { useState } from "react";
import axios from "axios";

export default function WebhookForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [candles, setCandles] = useState("[");
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    try {
      const parsedCandles = JSON.parse(candles);
      const response = await axios.post("https://trade-analyze-backend.onrender.com/api/analyze", {
        symbol,
        interval,
        rsi_period: parseInt(rsiPeriod),
        candles: parsedCandles,
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Veri analiz edilirken hata oluştu. JSON formatını veya sunucu bağlantısını kontrol edin.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">📊 Trade Analiz Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Sembol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={rsiPeriod}
          onChange={(e) => setRsiPeriod(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="14">RSI Period: 14 (Standart)</option>
          <option value="7">RSI Period: 7</option>
          <option value="21">RSI Period: 21</option>
        </select>

        <textarea
          rows="5"
          placeholder="Candles JSON"
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-8"
      >
        Analiz Et
      </button>

      {analysis && (
        <div className="grid grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">🔍 Özet Analiz
            </h2>
            <p><b>Symbol:</b> {analysis.symbol}</p>
            <p><b>Interval:</b> {analysis.interval}</p>
            <p><b>Veri Sayısı:</b> {analysis.candles_count}</p>
            <p><b>Ortalama Kapanış:</b> {analysis.analysis.average_close}</p>
            <p><b>Ortalama Hacim:</b> {analysis.analysis.average_volume}</p>
            <p><b>En Yüksek Fiyat:</b> {analysis.analysis.highest_price}</p>
            <p><b>En Düşük Fiyat:</b> {analysis.analysis.lowest_price}</p>
            <p><b>Trend Yönü:</b> {analysis.analysis.trend_direction}</p>
            <p><b>Trend Gücü (%):</b> {analysis.analysis.trend_strength_percent}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">🔦 İleri Düzey Analiz
            </h2>
            <p><b>RSI Değeri:</b> {analysis.analysis.rsi_value ?? "-"}</p>
            <p><b>EMA (14):</b> {analysis.analysis.ema_value ?? "-"}</p>
            <p><b>MACD:</b> {analysis.analysis.macd_value ?? "-"}</p>
            <p><b>Stochastic %K:</b> {analysis.analysis.stochastic_k_value ?? "-"}</p>
            <p><b>ADX Değeri:</b> {analysis.analysis.adx_value ?? "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
