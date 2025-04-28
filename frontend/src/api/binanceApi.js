// src/api/binanceApi.js

export async function fetchBinanceCandles(symbol, interval) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Binance verisi çekilemedi');
  }

  const data = await response.json();
  
  return data.map(candle => ({
    timestamp: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));
}
