// src/api/binanceAnalyze.js

import { calculateRSI, calculateMACD, calculateADX } from './indicators'; // İndikatörleri buradan çekiyoruz

export async function analyzeCandles(candles) {
  try {
    const averageClose = candles.reduce((sum, c) => sum + c.close, 0) / candles.length;
    const averageVolume = candles.reduce((sum, c) => sum + c.volume, 0) / candles.length;

    const lastCandle = candles[candles.length - 1];
    const rsiValue = calculateRSI(candles);
    const macdValue = calculateMACD(candles);
    const adxValue = calculateADX(candles);

    let trendDirection = 'Yatay';
    if (rsiValue > 70 && macdValue > 0) trendDirection = 'Yukarı';
    else if (rsiValue < 30 && macdValue < 0) trendDirection = 'Aşağı';

    const trendStrengthPercent = Math.abs(rsiValue - 50) * 2;

    const strategies = [];

    if (rsiValue > 70) {
      strategies.push({
        name: "Aşırı Alım - Satış Fırsatı",
        explanation: "RSI aşırı alım bölgesinde. Satış fırsatı değerlendirilebilir."
      });
    } else if (rsiValue < 30) {
      strategies.push({
        name: "Aşırı Satım - Alım Fırsatı",
        explanation: "RSI aşırı satım bölgesinde. Alım fırsatı değerlendirilebilir."
      });
    }

    if (macdValue > 0) {
      strategies.push({
        name: "MACD Pozitif",
        explanation: "MACD pozitif. Yukarı yönlü trend sinyali."
      });
    } else if (macdValue < 0) {
      strategies.push({
        name: "MACD Negatif",
        explanation: "MACD negatif. Aşağı yönlü trend sinyali."
      });
    }

    if (adxValue > 25) {
      strategies.push({
        name: "ADX Güçlü Trend",
        explanation: "ADX yüksek. Piyasa güçlü trend içinde."
      });
    } else {
      strategies.push({
        name: "ADX Zayıf Trend",
        explanation: "ADX düşük. Piyasa yatay olabilir."
      });
    }

    const detailedAnalysis = `
🔹 RSI Değeri: ${rsiValue.toFixed(2)}
🔹 MACD Değeri: ${macdValue.toFixed(2)}
🔹 ADX Değeri: ${adxValue.toFixed(2)}
🔹 Ortalama Kapanış Fiyatı: ${averageClose.toFixed(2)}
🔹 Ortalama İşlem Hacmi: ${averageVolume.toFixed(2)}
🔹 Trend Yönü: ${trendDirection}
🔹 Trend Gücü: %${trendStrengthPercent.toFixed(2)}
    `.trim();

    // 🔥 BURADA İNDIKATOR VALUELARI EKLİYORUZ
    const indicatorValues = {
      "calculate_rsi": rsiValue,
      "calculate_macd": macdValue,
      "calculate_adx": adxValue,
      "trend_strength_percent": trendStrengthPercent,
      "average_close": averageClose,
      "average_volume": averageVolume,
    };

    return {
      success: true,
      indicator_values: indicatorValues, // 🔥 Artık indicatorValues da dönüyoruz
      analysis: {
        average_close: averageClose,
        average_volume: averageVolume,
        rsi_value: rsiValue,
        macd_value: macdValue,
        adx_value: adxValue,
        trend_direction: trendDirection,
        trend_strength_percent: trendStrengthPercent,
        detailed_analysis: detailedAnalysis,
      },
      strategies: strategies,
    };
  } catch (error) {
    console.error('Binance analiz hatası:', error);
    return { success: false, error: 'Analiz sırasında hata oluştu' };
  }
}
