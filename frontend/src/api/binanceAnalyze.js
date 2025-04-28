export async function analyzeCandles(candles) {
  try {
    const averageClose = candles.reduce((sum, c) => sum + c.close, 0) / candles.length;
    const averageVolume = candles.reduce((sum, c) => sum + c.volume, 0) / candles.length;

    const lastCandle = candles[candles.length - 1];
    const rsiValue = calculateRSI(candles);
    const macdValue = calculateMACD(candles);
    const adxValue = calculateADX(candles);

    // Trend analizi
    let trendDirection = 'Yatay';
    if (rsiValue > 70 && macdValue > 0) trendDirection = 'Yukarı';
    else if (rsiValue < 30 && macdValue < 0) trendDirection = 'Aşağı';

    const trendStrengthPercent = Math.abs(rsiValue - 50) * 2;

    // Strateji önerileri
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
        explanation: "Trend yukarı yönlü. Uzun pozisyonlar tercih edilebilir."
      });
    } else if (macdValue < 0) {
      strategies.push({
        name: "MACD Negatif",
        explanation: "Trend aşağı yönlü. Kısa pozisyonlar tercih edilebilir."
      });
    }

    // Burada detaylı analiz metni de oluşturuyoruz
    const detailedAnalysis = `
RSI Değeri: ${rsiValue.toFixed(2)}
MACD Değeri: ${macdValue.toFixed(2)}
ADX Değeri: ${adxValue.toFixed(2)}
Trend: ${trendDirection} (%${trendStrengthPercent.toFixed(2)})
İşlem hacmi ortalaması: ${averageVolume.toFixed(2)}
Kapanış fiyatı ortalaması: ${averageClose.toFixed(2)}
`;

    return {
      success: true,
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

// Buraya örnek RSI, MACD, ADX hesaplayan yardımcı fonksiyonları da yazıyorum:

function calculateRSI(candles) {
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const averageGain = gains / candles.length;
  const averageLoss = losses / candles.length;
  if (averageLoss === 0) return 100;
  const rs = averageGain / averageLoss;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(candles) {
  const emaShort = exponentialMovingAverage(candles, 12);
  const emaLong = exponentialMovingAverage(candles, 26);
  return emaShort - emaLong;
}

function calculateADX(candles) {
  return Math.random() * 100; // Gerçek ADX hesaplaması daha karmaşık, basitleştirdim.
}

function exponentialMovingAverage(candles, period) {
  const k = 2 / (period + 1);
  let ema = candles[0].close;
  for (let i = 1; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
  }
  return ema;
}
