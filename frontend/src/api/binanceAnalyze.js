import axios from 'axios';

// Front ve back aynı domain’de deploy edildi:
const API_URL        = 'https://trade-analyze-app-1.onrender.com/api/analyze';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

export async function analyzeCandles(symbol, interval) {
  try {
    // 1) Binance’den candle verisi çek
    const binanceResponse = await axios.get(BINANCE_API_URL, {
      params: { symbol, interval, limit: 100 },
    });

    // 2) timestamp ile birlikte objeyi oluştur
    const candles = binanceResponse.data.map(item => ({
      timestamp: item[0],
      open:      parseFloat(item[1]),
      high:      parseFloat(item[2]),
      low:       parseFloat(item[3]),
      close:     parseFloat(item[4]),
      volume:    parseFloat(item[5]),
    }));

    // 3) Backend’e POST et
    const response = await axios.post(API_URL, { candles });
    if (response.data?.status === 'ok') {
      return {
        indicator_values: response.data.indicator_values,
        summary:          response.data.summary,
        strategies:       response.data.strategies,
      };
    }
    throw new Error('API yanıtı başarısız.');

  } catch (err) {
    console.error('Veri çekme/analiz hatası:', err);
    throw err;
  }
}
