// src/api/binanceAnalyze.js

export async function analyzeCandles(candles) {
  try {
    const response = await fetch('https://trade-analyze-backend.onrender.com/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candles }),
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
