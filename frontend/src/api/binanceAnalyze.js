// src/api/binanceAnalyze.js

import axios from 'axios';

const API_URL = 'https://trade-analyze-backend.onrender.com/api/analyze'; 
// Backend API adresin (eğer değiştiyse burayı güncelle)

export async function analyzeCandles(candles) {
  try {
    const response = await axios.post(API_URL, { candles });

    if (response.data && response.data.success) {
      return {
        indicator_values: response.data.indicator_values || {},
        summary: response.data.summary || {},
        strategies: response.data.strategies || [],
      };
    } else {
      throw new Error('API yanıtı başarısız.');
    }
  } catch (error) {
    console.error('Veri çekme veya analiz hatası:', error);
    throw new Error('Veri çekme veya analiz hatası oluştu.');
  }
}
