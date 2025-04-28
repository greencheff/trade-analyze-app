import axios from "axios";

const BINANCE_BASE_URL = "https://api.binance.com";

export async function fetchBinanceKlines(symbol = "BTCUSDT", interval = "1m", limit = 100) {
  try {
    const response = await axios.get(`${BINANCE_BASE_URL}/api/v3/klines`, {
      params: {
        symbol,
        interval,
        limit,
      },
    });

    // Veriyi istediğimiz formata sokuyoruz
    const formattedData = response.data.map(candle => ({
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
    }));

    return formattedData;
  } catch (error) {
    console.error("Binance Klines çekilirken hata:", error);
    throw error;
  }
}
