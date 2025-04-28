// src/pages/Dashboard.jsx

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { analyzeCandles } from '../api/binanceAnalyze'; // 🔥 doğru import
import IndicatorDropdown from '../components/IndicatorDropdown';

export default function Dashboard() {
  // Buradan sonra senin diğer kodların aynı şekilde devam edecek...
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
        detailedAnalysis: result.analysis?.detailed_analysis || "Detaylı analiz verisi bulunamadı.",
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

          {/* Analiz Başlatma Alanı */}
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

          {/* Analiz Sonuçları */}
          {feedbacks.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-2">{item.symbol} ({item.interval})</h2>
              <div className="text-gray-700 space-y-1 text-sm">
                <p><strong>Trend Yönü:</strong> {item.trendDirection} ({item.trendStrength}%)</p>
                <p><strong>RSI:</strong> {item.rsi}</p>
                <p><strong>MACD:</strong> {item.macd}</p>
                <p><strong>ADX:</strong> {item.adx}</p>
              </div>

              {/* Detaylı Analiz */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm whitespace-pre-line">
                {item.detailedAnalysis}
              </div>

              {/* Strateji Önerileri */}
              {item.strategies.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-md text-green-700 mb-2">Strateji Önerileri:</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    {item.strategies.map((strategy, i) => (
                      <li key={i}>
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
