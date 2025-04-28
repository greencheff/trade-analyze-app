import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import FeedbackList from '../components/FeedbackList.jsx';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');

  const handleAnalyze = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
      const rawData = await response.json();

      const candles = rawData.map(item => ({
        openTime: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));

      // Burada backend analizi bekleniyor, ancak test için local veriyle devam ediyoruz
      const testResult = {
        message: `Başarıyla ${candles.length} veri noktası alındı.`,
        strategies: [],
      };

      setFeedbacks((prev) => [testResult, ...prev]);
      if (testResult?.strategies) {
        setStrategies(testResult.strategies);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      alert('Veri çekilirken hata oluştu. Lütfen tekrar deneyin.');
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
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Analiz Et
              </button>
            </div>
          </div>

          {/* Analiz Geri Bildirimleri */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <FeedbackList items={feedbacks} />
          </div>

          {/* Strateji Sonuçları */}
          {strategies.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Strateji Sonuçları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategies.map((strategy, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg shadow ${
                      strategy.signal ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <h3 className="text-lg font-semibold">{strategy.name}</h3>
                    <p className="text-sm mt-1">{strategy.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
