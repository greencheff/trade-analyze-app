// trade-analyze-frontend/src/api/binanceAnalyze.js

import axios from 'axios'

// Öncelikle .env’den oku; yoksa full URL’e dön
const API_URL = process.env.VITE_API_URL
  || import.meta.env.VITE_API_URL
  || 'https://trade-analyze-backend.onrender.com/api/analyze'

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines'

/**
 * @param {string} symbol  Örn. "BTCUSDT"
 * @param {string} interval Örn. "1m", "5m", "1h"
 */
export async function analyzeCandles(symbol, interval) {
  try {
    // 1) Binance’den mum verilerini çek
    const binanceResp = await axios.get(BINANCE_API_URL, {
      params: { symbol, interval, limit: 100 }
    })

    // 2) Timestamp dahil bir obje dizisi oluştur
    const candles = binanceResp.data.map(c => ({
      timestamp: c[0],
      open:      parseFloat(c[1]),
      high:      parseFloat(c[2]),
      low:       parseFloat(c[3]),
      close:     parseFloat(c[4]),
      volume:    parseFloat(c[5]),
    }))

    // 3) Backend’e POST et
    const resp = await axios.post(API_URL, { candles })

    // 4) Yanıtı kontrol et
    if (resp.status === 200 && resp.data.status === 'ok') {
      return {
        indicator_values: resp.data.indicator_values,
        summary:          resp.data.summary,
        strategies:       resp.data.strategies,
      }
    } else {
      console.error('API başarısız:', resp.data)
      throw new Error(resp.data.detail || 'API yanıt hatası')
    }

  } catch (err) {
    // Hata detayını konsola bas, kullanıcıya sade mesaj fırlat
    console.error('Analiz hatası detay:', err.response?.data || err.message)
    throw new Error(
      'Veri çekme/analiz hatası: ' +
      (err.response?.data?.detail || err.message)
    )
  }
}
