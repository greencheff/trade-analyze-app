// src/api/indicators.js

export function calculateRSI(candles, period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = candles[i].close - candles[i - 1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  if (gains === 0 && losses === 0) return 50; // Fiyat sabit kaldıysa RSI 50

  const averageGain = gains / period;
  const averageLoss = losses / period;
  const rs = averageGain / (averageLoss || 1e-10);
  const rsi = 100 - 100 / (1 + rs);

  return rsi;
}

export function calculateMACD(candles, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
  const closes = candles.map(c => c.close);

  const emaShort = calculateEMA(closes, shortPeriod);
  const emaLong = calculateEMA(closes, longPeriod);

  const macdLine = emaShort.map((val, idx) => val - emaLong[idx]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine.map((val, idx) => val - signalLine[idx]);

  return histogram[histogram.length - 1];
}

function calculateEMA(values, period) {
  const k = 2 / (period + 1);
  const emaArray = [];
  let ema = values.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  emaArray[period - 1] = ema;

  for (let i = period; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    emaArray[i] = ema;
  }

  return emaArray;
}

export function calculateADX(candles, period = 14) {
  let trList = [];
  let plusDMList = [];
  let minusDMList = [];

  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];

    const highDiff = current.high - previous.high;
    const lowDiff = previous.low - current.low;

    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    trList.push(tr);

    plusDMList.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDMList.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
  }

  const smoothedTR = simpleMovingAverage(trList, period);
  const smoothedPlusDM = simpleMovingAverage(plusDMList, period);
  const smoothedMinusDM = simpleMovingAverage(minusDMList, period);

  const plusDI = smoothedPlusDM.map((val, idx) => (val / smoothedTR[idx]) * 100);
  const minusDI = smoothedMinusDM.map((val, idx) => (val / smoothedTR[idx]) * 100);

  const dx = plusDI.map((val, idx) => (Math.abs(val - minusDI[idx]) / (val + minusDI[idx] || 1e-10)) * 100);

  const adx = simpleMovingAverage(dx, period);

  return adx[adx.length - 1];
}

function simpleMovingAverage(values, period) {
  const smaArray = [];

  for (let i = 0; i <= values.length - period; i++) {
    const sum = values.slice(i, i + period).reduce((acc, val) => acc + val, 0);
    smaArray.push(sum / period);
  }

  return smaArray;
}
