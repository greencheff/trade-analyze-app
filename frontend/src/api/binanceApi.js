// trade-analyze-frontend/src/api/binanceAnalyze.js

import axios from 'axios'

// Ortam değişkeninden al; yoksa direkt hard-coded URL
const API_URL = import.meta.env.VITE_API_URL 
  || 'https://trade-analyze-backend.onrender.com/api/analyze'

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines'

/**
 * symbol: String örn. "BTCUSDT"
 * interval: String örn. "1m", "5m", "1h"
 */
export async function analyzeCandles(symbol, interval) {
  try {
    // 1) Binance'tan mum verisini çek
    const binanceResp = await axios.get(BINANCE_API_URL, {
      params: { symbol, interval, limit: 100 }
    })

    // 2) Timestamp dahil object dizisi oluştur
    const candles = binanceResp.data.map(c => ({
      timestamp: c[0],
      open:      parseFloat(c[1]),
      high:      parseFloat(c[2]),
      low:       parseFloat(c[3]),
      close:     parseFloat(c[4]),
      volume:    parseFloat(c[5])
    }))

    // 3) Backend API'ye POST et
    const resp = await axios.post(API_URL, { candles })

    // 4) Başarı durumunu kontrol et
    if (resp.status === 200 && resp.data.status === 'ok') {
      return {
        indicator_values: resp.data.indicator_values,
        summary:          resp.data.summary,
        strategies:       resp.data.strategies
      }
    } else {
      console.error('API yanıtı başarısız:', resp.data)
      throw new Error(resp.data.detail || 'API yanıtı başarısız.')
    }

  } catch (err) {
    // Konsola tam detaylı bas, kullanıcıya sade bir hata at
    console.error('Analiz hatası detay:', err.response?.data || err.message)
    throw new Error(
      'Veri çekme/analiz hatası: ' +
      (err.response?.data?.detail || err.message)
    )
  }
}
