// src/api/binanceApi.js

export async function fetchBinanceCandles(symbol, interval) {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    if (!response.ok) {
      throw new Error('Binance veri çekme hatası');
    }
    const rawData = await response.json();
    return rawData.map(item => ({
      openTime: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }));
  } catch (error) {
    console.error('Binance API Hatası:', error);
    throw error;
  }
}
