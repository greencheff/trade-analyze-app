import { useState } from "react";
import axios from "axios";

export default function BinanceFetcher({ onDataFetched }) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const binanceResponse = await axios.get(`https://api.binance.com/api/v3/klines`, {
        params: {
          symbol: symbol.toUpperCase(),
          interval: interval,
          limit: 500,
        },
      });

      const formattedData = binanceResponse.data.map(candle => ({
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));

      if (onDataFetched) {
        onDataFetched(formattedData);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      alert("Veri çekilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Binance'dan Gerçek Veri Çek</h2>

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

      <button
        onClick={fetchData}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {loading ? "Yükleniyor..." : "Veri Çek"}
      </button>
    </div>
  );
}
