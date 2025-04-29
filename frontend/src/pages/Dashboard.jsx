
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StrategySelect from '../components/StrategySelect';

export default function Dashboard() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [selectedIndicatorResult, setSelectedIndicatorResult] = useState(null);
  const [strategyResult, setStrategyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [indicators, setIndicators] = useState([]);

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
    if (!symbol || !interval) {
      alert('Lütfen sembol ve zaman aralığı giriniz.');
      return;
    }

    setLoading(true);
    try {
      const binanceResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=1000`);
      const binanceData = await binanceResponse.json();

      const candles = binanceData.map(item => ({
        timestamp: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));

      // İndikatör varsa gönder
      if (selectedIndicator) {
        const indicatorResponse = await fetch('https://trade-analyze-backend.onrender.com/api/single-indicator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candles, selectedIndicator }),
        });
        const indicatorData = await indicatorResponse.json();
        if (indicatorResponse.ok) {
          setSelectedIndicatorResult({
            name: indicatorDisplayNames[selectedIndicator] || selectedIndicator,
            value: indicatorData.value,
          });
        } else {
          alert(indicatorData.detail || 'İndikatör analizi başarısız.');
        }
      }

      // Strateji varsa gönder
      if (selectedStrategy) {
        const strategyResponse = await fetch('https://trade-analyze-backend.onrender.com/api/strategy-signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candles, strategy: selectedStrategy }),
        });
        const strategyData = await strategyResponse.json();
        if (strategyResponse.ok) {
          setStrategyResult(strategyData.strategy_result);
        } else {
          alert(
            strategyData.detail
              ? typeof strategyData.detail === 'object'
                ? JSON.stringify(strategyData.detail)
                : strategyData.detail
              : 'Strateji analizi başarısız.'
          );
        }
      }

    } catch (error) {
      console.error('Analiz hatası:', error);
      alert('Analiz sırasında hata oluştu.');
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
            <h2 className="text-lg font-semibold mb-4">Analiz Başlat</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Sembol (örn: BTCUSDT)"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="Zaman Aralığı (örn: 1m, 5m, 1h)"
                className="border p-2 rounded"
              />
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Bir İndikatör Seçiniz</option>
                {indicators.map((indicator) => (
                  <option key={indicator} value={indicator}>
                    {indicatorDisplayNames[indicator] || indicator}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <StrategySelect
                selectedStrategy={selectedStrategy}
                setSelectedStrategy={setSelectedStrategy}
              />
            </div>

            <button
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? 'Analiz Yapılıyor...' : 'Analiz Et'}
            </button>
          </div>

          {selectedIndicatorResult && (
            <div className="bg-white p-6 rounded-lg shadow mb-4">
              <h2 className="text-lg font-bold text-indigo-600 mb-2">{selectedIndicatorResult.name}</h2>
              <p className="text-gray-700 text-sm">
                Değer: {JSON.stringify(selectedIndicatorResult.value)}
              </p>
            </div>
          )}

          {strategyResult && (
            <div className="bg-white p-6 rounded-lg shadow mb-4">
              <h2 className="text-lg font-bold text-green-600 mb-2">Strateji Sonucu</h2>
              <p className="text-gray-700 text-sm">Sinyal: {strategyResult}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


