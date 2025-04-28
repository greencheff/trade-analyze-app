// src/api/binanceAnalyze.js

export async function analyzeSymbol(symbol, interval) {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      throw new Error("Binance API'den beklenen formatta veri alınamadı.");
    }

    const candles = rawData.map(item => ({
      timestamp: item[0],
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

    const rs = avgGain / avgLoss;
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

    // RSI Yorumu
    let rsiComment = '';
    if (rsi < 30) {
      rsiComment = `RSI ${rsi.toFixed(2)} (Aşırı Satım) → Alım fırsatı olabilir.`;
    } else if (rsi > 70) {
      rsiComment = `RSI ${rsi.toFixed(2)} (Aşırı Alım) → Dikkatli olunmalı.`;
    } else {
      rsiComment = `RSI ${rsi.toFixed(2)} (Nötr)`;
    }

    // MACD Yorumu
    let macdComment = '';
    if (macdHistogram > 0) {
      macdComment = `MACD ${macdHistogram.toFixed(2)} (Alım sinyali).`;
    } else if (macdHistogram < 0) {
      macdComment = `MACD ${macdHistogram.toFixed(2)} (Satış sinyali).`;
    } else {
      macdComment = `MACD ${macdHistogram.toFixed(2)} (Nötr).`;
    }

    // Genel Karar
    let finalDecision = '';
    if (rsi < 30 && macdHistogram > 0) {
      finalDecision = "GÜÇLÜ AL: RSI aşırı satım bölgesinde ve MACD pozitif.";
    } else if (rsi > 70 && macdHistogram < 0) {
      finalDecision = "GÜÇLÜ SAT: RSI aşırı alımda ve MACD negatif.";
    } else {
      finalDecision = "BELİRSİZ: Daha fazla sinyal beklenmeli.";
    }

    return {
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macdHistogram.toFixed(2)),
      explanation: `${rsiComment} | ${macdComment} => ${finalDecision}`
    };

  } catch (error) {
    console.error('Binance Analyze API Hatası:', error);
    throw error;
  }
}
