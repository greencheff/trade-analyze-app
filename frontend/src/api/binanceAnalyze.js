// src/api/binanceAnalyze.js

export async function analyzeCandles(candles, symbol = "BTCUSDT", interval = "1m", rsi_period = 14) {
  try {
    const response = await fetch('https://trade-analyze-backend.onrender.com/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        interval,
        rsi_period,
        candles
      }),
    });

    if (!response.ok) {
      throw new Error('Analiz isteği başarısız oldu.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analyze API Hatası:', error);
    throw error;
  }
}
