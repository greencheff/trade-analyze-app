// src/api/binanceAnalyze.js

export async function analyzeSymbol(symbol, interval) {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      throw new Error("Binance API'den veri çekilemedi.");
    }

    const candles = rawData.map(item => ({
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }));

    const closes = candles.map(candle => candle.close);

    // RSI Hesaplama
    const rsiPeriod = 14;
    if (closes.length < rsiPeriod) {
      throw new Error("Yeterli veri yok RSI hesaplamak için.");
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= rsiPeriod; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) {
        gains += diff;
      } else {
        losses -= diff;
      }
    }

    let avgGain = gains / rsiPeriod;
    let avgLoss = losses / rsiPeriod;
    const rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    // MACD Hesaplama
    function calculateEMA(data, period) {
      const k = 2 / (period + 1);
      let emaArray = [];
      let ema = data.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
      emaArray[period - 1] = ema;

      for (let i = period; i < data.length; i++) {
        ema = data[i] * k + ema * (1 - k);
        emaArray[i] = ema;
      }
      return emaArray;
    }

    const shortEMA = calculateEMA(closes, 12);
    const longEMA = calculateEMA(closes, 26);

    const macdLine = shortEMA.map((shortVal, index) => {
      const longVal = longEMA[index];
      if (shortVal !== undefined && longVal !== undefined) {
        return shortVal - longVal;
      }
      return null;
    }).filter(val => val !== null);

    const signalLine = calculateEMA(macdLine, 9);
    const latestMacd = macdLine[macdLine.length - 1] ?? 0;
    const latestSignal = signalLine[signalLine.length - 1] ?? 0;

    const macdHistogram = latestMacd - latestSignal;

    // Trend Yönü ve Gücü
    const trendDirection = closes[closes.length - 1] > closes[0] ? "Uptrend" : "Downtrend";
    const trendStrengthPercent = parseFloat((((closes[closes.length - 1] - closes[0]) / closes[0]) * 100).toFixed(2));

    // ADX Dummy (istersen ayrıca ADX hesaplama da ekleriz)
    const adx = 20; // Örnek sabit değer verdim istersen dinamik de yaparız

    // Detaylı Analiz
    let explanation = "";

    if (rsi < 30) {
      explanation += `RSI ${rsi.toFixed(2)} (Aşırı Satım) → Alım fırsatı olabilir. `;
    } else if (rsi > 70) {
      explanation += `RSI ${rsi.toFixed(2)} (Aşırı Alım) → Düzeltme gelebilir. `;
    } else {
      explanation += `RSI ${rsi.toFixed(2)} (Nötr). `;
    }

    if (macdHistogram > 0) {
      explanation += `MACD pozitif (${macdHistogram.toFixed(2)}).`;
    } else if (macdHistogram < 0) {
      explanation += `MACD negatif (${macdHistogram.toFixed(2)}).`;
    } else {
      explanation += `MACD nötr.`;
    }

    // Geri Dönüş
    return {
      analysis: {
        average_close: parseFloat((closes.reduce((a, b) => a + b) / closes.length).toFixed(2)),
        average_volume: parseFloat((candles.reduce((acc, cur) => acc + cur.volume, 0) / candles.length).toFixed(2)),
        trend_direction: trendDirection,
        trend_strength_percent: trendStrengthPercent,
        rsi_value: parseFloat(rsi.toFixed(2)),
        macd_value: parseFloat(macdHistogram.toFixed(2)),
        adx_value: adx,
        detailed_analysis: explanation,
      },
      strategies: [],
    };

  } catch (error) {
    console.error('Analyze API Hatası:', error);
    throw error;
  }
}
