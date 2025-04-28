// src/pages/Dashboard.jsx

import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import FeedbackList from '../components/FeedbackList.jsx';
import { analyzeCandles } from '../api/binanceAnalyze.js';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
      const rawData = await response.json();

      const candles = rawData.map(item => ({
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));

      const result = await analyzeCandles(candles);

      // Gelen veriyi uyarlıyoruz
      const feedbackItem = {
        symbol,
        interval,
        averageClose: result.analysis?.average_close,
        averageVolume: result.analysis?.average_volume,
        trendDirection: result.analysis?.trend_direction,
        trendStrength: result.analysis?.trend_strength_percent,
        rsi: result.analysis?.rsi_value,
        macd: result.analysis?.macd_value,
        adx: result.analysis?.adx_value,
        detailedAnalysis: result.analysis?.detailed_analysis || "Detaylı açıklama bulunamadı.",
        strategies: result.strategies || []
      };

      setFeedbacks(prev => [feedbackItem, ...prev]);
    } catch (error) {
      console.error('Veri çekme veya analiz hatası:', error);
      alert('Veri çekilirken veya analiz edilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <h1 className="text-xl font-bold mb-4">Dashboard</h1>

          {/* Veri Girişi */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Analiz Başlat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Örn: BTCUSDT"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="Örn: 1m, 5m, 1h"
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? 'Analiz Yapılıyor...' : 'Analiz Et'}
              </button>
            </div>
          </div>

          {/* Analiz Geri Bildirimleri */}
          {feedbacks.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-bold text-indigo-700">{item.symbol} ({item.interval})</h2>
              <p className="text-sm text-gray-500 mb-2">Trend: {item.trendDirection} ({item.trendStrength}%)</p>
              <p className="text-sm text-gray-500 mb-2">RSI: {item.rsi} | MACD: {item.macd} | ADX: {item.adx}</p>
              <p className="text-sm mt-2">{item.detailedAnalysis}</p>

              {item.strategies && item.strategies.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-md text-green-700 mb-2">Strateji Sonuçları:</h3>
                  <ul className="list-disc ml-5">
                    {item.strategies.map((strategy, i) => (
                      <li key={i} className="text-sm">
                        <strong>{strategy.name}:</strong> {strategy.explanation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
