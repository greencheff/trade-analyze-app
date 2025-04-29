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
      alert('İndikatör analizi sırasında
