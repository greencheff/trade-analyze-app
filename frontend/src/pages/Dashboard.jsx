import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [symbol, setSymbol] = useState('BTCUSDT'); // Şu anda sabit
  const [interval, setInterval] = useState('1m');   // 1 dakikalık mumlar
  const [loading, setLoading] = useState(false);
  const [indicatorValues, setIndicatorValues] = useState({});
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedIndicatorResult, setSelectedIndicatorResult] = useState(null);
  const [indicators, setIndicators] = useState([]);

  // Kullanıcı dostu isimler
  const indicatorDisplayNames = {
    "calculate_rsi": "RSI",
    "calculate_macd": "MACD",
    "calculate_adx": "ADX",
    "calculate_bollinger_bands": "Bollinger Bands",
    "calculate_ema": "EMA",
    "calculate_sma": "SMA",
    "calculate_atr": "ATR",
    "calculate_stochastic_oscillator": "Stochastic Oscillator",
    "calculate_vwap": "VWAP",
    "calculate_obv": "OBV",
  };

  useEffect(() => {
    // İndikatör listesini backend'den çekiyoruz
    fetch('https://trade-analyze-backend.onrender.com/api/indicators')
      .then((res) => res.json())
      .then((data) => {
        setIndicators(data.indicators || []);
      })
      .catch((error) => {
        console.error('İndikatör listesi çekilemedi:', error);
      });
  }, []);

  const handleIndicatorAnalyze = async () => {
    if (!selectedIndicator) {
      alert('Lütfen bir indikatör seçiniz.');
      return;
    }

    setLoading(true);
    try {
      // 🔵 Binance API'den canlı BTCUSDT verisi çekiyoruz
      const binanceResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`);
      const binanceData = await binanceResponse.json();

      const candles = binanceData.map(item => ({
        timestamp: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));

      const response = await fetch('https://trade-analyze-backend.onrender.com/single-indicator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candles: candles,
          selectedIndicator: selectedIndicator,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedIndicatorResult({
          name: indicatorDisplayNames[selectedIndicator] || selectedIndicator,
          value: data.value,
        });
      } else {
        alert(data.detail || 'İndikatör analizi başarısız oldu.');
      }
    } catch (error) {
      console.error('İndikatör analizi hatası:', error);
      alert('İndikatör analizi sırasında hata oluştu.');
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

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">İndikatör Seçimi</h2>

            <div className="flex gap-4 mb-4">
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Bir İndikatör Seçiniz</option>
                {indicators.map((indicator) => (
                  <option key={indicator} value={indicator}>
                    {indicatorDisplayNames[indicator] || indicator}
                  </option>
                ))}
              </select>

              <button
                onClick={handleIndicatorAnalyze}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'İşlem Yapılıyor...' : 'Seçili İndikatörü Analiz Et'}
              </button>
            </div>

            {selectedIndicatorResult && (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                <h3 className="text-lg font-semibold">{selectedIndicatorResult.name}</h3>
                <p>Değer: {JSON.stringify(selectedIndicatorResult.value)}</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
