// src/api/binanceAnalyze.js

import axios from 'axios';

const API_URL = 'https://trade-analyze-backend.onrender.com/api/analyze'; 
const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

export async function analyzeCandles(symbol, interval) {
  try {
    // 1. Binance'tan candles verisi çek
    const binanceResponse = await axios.get(BINANCE_API_URL, {
      params: {
        symbol: symbol,
        interval: interval,
        limit: 100
      }
    });

    const candles = binanceResponse.data.map(item => ({
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }));

    // 2. FastAPI'ye candles verisini gönder
    const response = await axios.post(API_URL, { candles });

    if (response.data && response.data.status === "ok") {
      return {
        indicator_values: response.data.indicator_values || {},
        summary: response.data.summary || {},
        strategies: response.data.strategies || [],
      };
    } else {
      throw new Error('API yanıtı başarısız.');
    }
  } catch (error) {
    console.error('Veri çekme veya analiz etme hatası:', error);
    throw new Error('Veri çekme veya analiz hatası oluştu.');
  }
}
