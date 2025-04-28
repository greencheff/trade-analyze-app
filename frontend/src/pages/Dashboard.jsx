import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import WebhookForm from '../components/WebhookForm.jsx';
import FeedbackList from '../components/FeedbackList.jsx';
import BinanceFetcher from '../components/BinanceFetcher.jsx';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [strategies, setStrategies] = useState([]);

  const handleResult = (data) => {
    setFeedbacks((prev) => [data, ...prev]);
    if (data?.strategies) {
      setStrategies(data.strategies);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <h1 className="text-xl font-bold mb-4">Dashboard</h1>

          {/* Binance Verisi Çekme */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Binance'dan Gerçek Zamanlı Veri Çek</h2>
            <BinanceFetcher />
          </div>

          {/* Form ve Sonuçlar */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <WebhookForm onResult={handleResult} />
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
