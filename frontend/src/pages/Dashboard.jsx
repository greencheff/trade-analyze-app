import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { analyzeCandles } from '../api/binanceAnalyze';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [loading, setLoading] = useState(false);
  const [indicatorValues, setIndicatorValues] = useState({});
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedIndicatorResult, setSelectedIndicatorResult] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [candlesData, setCandlesData] = useState([]); // 🔵 candle verilerini tutacağız

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
    // İstediğin gibi genişletilebilir
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

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeCandles(symbol, interval);

      const feedbackItem = {
        symbol,
        interval,
        averageClose: result.summary?.average_close,
        averageVolume: result.summary?.average_volume,
        trendDirection: result.summary?.trend_direction,
        trendStrength: result.summary?.trend_strength_percent,
        rsi: result.indicator_values?.rsi,
        macd: result.indicator_values?.macd,
        adx: result.indicator_values?.adx,
        detailedAnalysis: result.summary?.detailed_analysis || "Detaylı analiz verisi bulunamadı.",
        strategies: result.strategies || [],
      };

      setFeedbacks(prev => [feedbackItem, ...prev]);
      setIndicatorValues(result.indicator_values || {});

      // 🔵 Candle verilerini de ayrıca kaydediyoruz (seçili indikatör analizi için kullanacağız)
      setCandlesData(result.candles || []);
    } catch (error) {
      console.error('Veri çekme veya analiz hatası:', error);
      alert('Veri çekilirken veya analiz edilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleIndicatorAnalyze = async () => {
    if (!selectedIndicator) {
      alert('Lütfen bir indikatör seçiniz.');
      return;
    }

    if (candlesData.length === 0) {
      alert('Önce bir analiz yapıp veri çekmelisiniz.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://trade-analyze-backend.onrender.com/single-indicator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candles: candlesData,
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

          {feedbacks.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-2">{item.symbol} ({item.interval})</h2>
              <div className="text-gray-700 space-y-1 text-sm">
                <p><strong>Trend Yönü:</strong> {item.trendDirection} ({item.trendStrength}%)</p>
                <p><strong>RSI:</strong> {item.rsi !== undefined ? item.rsi.toFixed(2) : '-'}</p>
                <p><strong>MACD:</strong> {item.macd !== undefined ? item.macd.toFixed(4) : '-'}</p>
                <p><strong>ADX:</strong> {item.adx !== undefined ? item.adx.toFixed(2) : '-'}</p>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm whitespace-pre-line">
                {item.detailedAnalysis}
              </div>

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
