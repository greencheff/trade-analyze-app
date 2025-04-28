// src/binanceApi.js

export async function fetchBinanceCandles(symbol, interval) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Veri formatı beklenenden farklı: ' + JSON.stringify(data));
    }

    const candles = data.map(item => ({
      openTime: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }));

    return candles;
  } catch (error) {
    console.error('Binance API Hatası:', error);
    throw error;
  }
}
