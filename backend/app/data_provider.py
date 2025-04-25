import json
from redis import Redis
import ccxt

from .config import settings

redis_client = Redis.from_url(settings.REDIS_URL)
binance = ccxt.binance({
    'apiKey': settings.BINANCE_API_KEY,
    'secret': settings.BINANCE_API_SECRET,
})

class DataProvider:
    @staticmethod
    def get_historical(symbol: str, interval: str, limit: int = 100):
        cache_key = f"hist:{symbol}:{interval}:{limit}"
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
        data = binance.fetch_ohlcv(symbol, timeframe=interval, limit=limit)
        candles = [{"open": o, "high": h, "low": l, "close": c, "volume": v} for o, h, l, c, v in data]
        redis_client.setex(cache_key, 60, json.dumps(candles))
        return candles
