import React, { useState } from "react";

function WebhookForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [candles, setCandles] = useState(`[{"open":100,"high":110,"low":90,"close":105,"volume":1500}]`);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

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
        }),
      });

      if (!response.ok) {
        throw new Error("Sunucudan hata alındı");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Sunucuya bağlanılamadı veya hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Interval</label>
          <input
            type="text"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Candles (JSON)</label>
          <textarea
            value={candles}
            onChange={(e) => setCandles(e.target.value)}
            className="w-full p-2 border rounded"
            rows="6"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Analiz Ediliyor..." : "Analiz Et"}
        </button>
      </form>

      <div className="mt-6">
        {error && <div className="text-red-500">{error}</div>}
        {result && (
          <div className="p-4 mt-4 border rounded bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">Analiz Sonucu:</h3>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebhookForm;
