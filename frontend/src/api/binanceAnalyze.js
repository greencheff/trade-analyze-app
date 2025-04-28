// src/api/binanceAnalyze.js

import axios from 'axios';

// Backend URL güncellendi:
const API_URL = 'https://trade-analyze-app-1.onrender.com/api/analyze';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

export async function analyzeCandles(symbol, interval) {
  try {
    // 1. Binance'tan candles verisi çek
    const binanceResponse = await axios.get(BINANCE_API_URL, {
      params: { symbol, interval, limit: 100 },
    });

    // 2. Zaman bilgisini de içerecek şekilde candles dizisini oluştur
    const candles = binanceResponse.data.map(item => ({
      timestamp: item[0],
      open:     parseFloat(item[1]),
      high:     parseFloat(item[2]),
      low:      parseFloat(item[3]),
      close:    parseFloat(item[4]),
      volume:   parseFloat(item[5]),
    }));

    // 3. FastAPI'ye candles verisini gönder
    const response = await axios.post(API_URL, { candles });

    if (response.data?.status === 'ok') {
      return {
        indicator_values: response.data.indicator_values || {},
        summary:          response.data.summary          || {},
        strategies:       response.data.strategies       || [],
      };
    }
    throw new Error('API yanıtı başarısız.');

  } catch (error) {
    console.error('Veri çekme veya analiz etme hatası:', error);
    throw new Error('Veri çekme veya analiz hatası oluştu.');
  }
}
