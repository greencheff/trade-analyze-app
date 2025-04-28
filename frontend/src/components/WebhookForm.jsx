import { useState } from "react";
import axios from "axios";

export default function WebhookForm({ onResult }) {
  const [symbol, setSymbol] = useState("");
  const [interval, setInterval] = useState("");
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [candles, setCandles] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    try {
      let parsedCandles = JSON.parse(candles);

      // Ekstra kontrol: veri bir liste mi?
      if (!Array.isArray(parsedCandles)) {
        alert("Veri bir liste (array) formatında olmalı! Lütfen [ { }, { } ] yapısında gönderin.");
        return;
      }

      setLoading(true);

      const response = await axios.post("https://trade-analyze-backend.onrender.com/api/analyze", {
        symbol,
        interval,
        rsi_period: parseInt(rsiPeriod),
        candles: parsedCandles,  // dikkat: parse edilmiş JSON veri
      });

      setAnalysis(response.data);
      if (onResult) {
        onResult(response.data);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Veri analiz edilirken hata oluştu. Lütfen JSON formatını veya sunucu bağlantısını kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Veri Gönderimi</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Sembol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Örn: BTCUSDT"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Zaman Aralığı</label>
        <input
          type="text"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Örn: 1m, 5m, 1h"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">RSI Periyodu</label>
        <input
          type="number"
          value={rsiPeriod}
          onChange={(e) => setRsiPeriod(e.target.value)}
          className="w-full border p-2 rounded"
          min={1}
          max={100}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Candle Verisi (JSON)</label>
        <textarea
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
          className="w-full border p-2 rounded h-48"
          placeholder='[
  {"timestamp":1714483200000,"open":62000.5,"high":62350.8,"low":61800.2,"close":62200.6,"volume":155.4},
  {"timestamp":1714483260000,"open":62200.6,"high":62300.0,"low":62050.1,"close":62100.0,"volume":145.2}
]'
        ></textarea>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Yükleniyor..." : "Analiz Et"}
      </button>

      {analysis && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Analiz Sonucu</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
