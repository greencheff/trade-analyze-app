import { fetchBinanceCandles } from './binanceApi';

export async function analyzeSymbol(symbol, interval) {
  try {
    const candles = await fetchBinanceCandles(symbol, interval);

    if (!candles || candles.length === 0) {
      throw new Error('Veri çekilemedi veya boş veri döndü.');
    }

    // Şu anda sadece veri çekiyoruz, backend analizi yok. 
    // İstersen burada bir test analizi simüle edebiliriz.
    return {
      success: true,
      candles,
      message: `${symbol} için ${candles.length} adet mum verisi başarıyla alındı.`,
      strategies: [], // Şimdilik boş, ileride strateji analizi ekleyeceğiz
    };
  } catch (error) {
    console.error('Sembol analiz hatası:', error);
    return {
      success: false,
      message: error.message || 'Analiz sırasında bir hata oluştu.',
    };
  }
}
