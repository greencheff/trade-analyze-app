from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

# Yardımcı hesaplama fonksiyonları
def calculate_rsi(closes, period=14):
    if len(closes) < period:
        return None
    gains = []
    losses = []
    for i in range(1, period + 1):
        delta = closes[i] - closes[i - 1]
        if delta >= 0:
            gains.append(delta)
        else:
            losses.append(abs(delta))
    average_gain = sum(gains) / period
    average_loss = sum(losses) / period
    if average_loss == 0:
        return 100
    rs = average_gain / average_loss
    rsi = 100 - (100 / (1 + rs))
    return round(rsi, 2)

def calculate_ema(closes, period=14):
    if len(closes) < period:
        return None
    k = 2 / (period + 1)
    ema = closes[0]
    for price in closes[1:]:
        ema = price * k + ema * (1 - k)
    return round(ema, 2)

def calculate_macd(closes, short_period=12, long_period=26):
    if len(closes) < long_period:
        return None
    short_ema = calculate_ema(closes[-short_period:], short_period)
    long_ema = calculate_ema(closes[-long_period:], long_period)
    if short_ema is None or long_ema is None:
        return None
    return round(short_ema - long_ema, 2)

def calculate_stochastic_k(highs, lows, closes):
    if not highs or not lows or not closes:
        return None
    highest_high = max(highs)
    lowest_low = min(lows)
    if highest_high == lowest_low:
        return 0
    k = ((closes[-1] - lowest_low) / (highest_high - lowest_low)) * 100
    return round(k, 2)

def calculate_adx(highs, lows, closes, period=14):
    if len(highs) < period + 1 or len(lows) < period + 1 or len(closes) < period + 1:
        return None
    return 20.0  # Şimdilik sabit değer, geliştirmeye açık

@router.post("/api/analyze")
async def analyze_data(request: Request):
    try:
        data = await request.json()
        symbol = data.get("symbol", "Unknown")
        interval = data.get("interval", "Unknown")
        rsi_period = data.get("rsi_period", 14)
        candles = data.get("candles", [])

        if not candles or not isinstance(candles, list):
            return JSONResponse(status_code=400, content={"error": "Invalid candle data"})

        closes = [candle.get("close") for candle in candles if candle.get("close") is not None]
        volumes = [candle.get("volume") for candle in candles if candle.get("volume") is not None]
        highs = [candle.get("high") for candle in candles if candle.get("high") is not None]
        lows = [candle.get("low") for candle in candles if candle.get("low") is not None]

        if not closes or not volumes or not highs or not lows:
            return JSONResponse(status_code=400, content={"error": "Missing required fields in candles"})

        average_close = sum(closes) / len(closes)
        average_volume = sum(volumes) / len(volumes)
        highest_price = max(highs)
        lowest_price = min(lows)

        trend_direction = "Sideways"
        if closes[-1] > closes[0]:
            trend_direction = "Uptrend"
        elif closes[-1] < closes[0]:
            trend_direction = "Downtrend"

        try:
            trend_strength = round(((closes[-1] - closes[0]) / closes[0]) * 100, 2)
        except ZeroDivisionError:
            trend_strength = 0.0

        rsi_value = calculate_rsi(closes, period=rsi_period)
        ema_value = calculate_ema(closes, period=14)
        macd_value = calculate_macd(closes)
        stochastic_k_value = calculate_stochastic_k(highs, lows, closes)
        adx_value = calculate_adx(highs, lows, closes, period=14)

        return JSONResponse(content={
            "status": "ok",
            "symbol": symbol,
            "interval": interval,
            "candles_count": len(candles),
            "analysis": {
                "average_close": round(average_close, 2),
                "average_volume": round(average_volume, 2),
                "highest_price": highest_price,
                "lowest_price": lowest_price,
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength,
                "rsi_value": rsi_value,
                "rsi_period": rsi_period,
                "ema_value": ema_value,
                "macd_value": macd_value,
                "stochastic_k_value": stochastic_k_value,
                "adx_value": adx_value
            }
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
