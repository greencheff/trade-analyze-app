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
    sma = sum(closes[:period]) / period
    multiplier = 2 / (period + 1)
    ema = sma
    for close in closes[period:]:
        ema = (close - ema) * multiplier + ema
    return round(ema, 2)

def calculate_macd(closes):
    ema_12 = calculate_ema(closes, 12)
    ema_26 = calculate_ema(closes, 26)
    if ema_12 is None or ema_26 is None:
        return None
    macd = ema_12 - ema_26
    return round(macd, 2)

def calculate_stochastic_oscillator(closes, highs, lows, period=14):
    if len(closes) < period or len(highs) < period or len(lows) < period:
        return None
    highest_high = max(highs[-period:])
    lowest_low = min(lows[-period:])
    if highest_high == lowest_low:
        return 0
    k = (closes[-1] - lowest_low) / (highest_high - lowest_low) * 100
    return round(k, 2)

def calculate_adx(highs, lows, closes, period=14):
    if len(highs) < period or len(lows) < period or len(closes) < period:
        return None
    return round(25.0, 2)  # Basitleştirilmiş ADX değeri (placeholder)

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
        stochastic_value = calculate_stochastic_oscillator(closes, highs, lows, period=14)
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
                "stochastic_value": stochastic_value,
                "adx_value": adx_value
            }
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
