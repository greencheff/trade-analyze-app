import statistics
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/api/analyze")
async def analyze_data(request: Request):
    try:
        data = await request.json()
        symbol = data.get("symbol", "Unknown")
        interval = data.get("interval", "Unknown")
        candles = data.get("candles", [])

        if not candles or not isinstance(candles, list):
            return JSONResponse(status_code=400, content={"error": "Invalid candle data"})

        closes = [candle.get("close") for candle in candles if candle.get("close") is not None]
        volumes = [candle.get("volume") for candle in candles if candle.get("volume") is not None]
        highs = [candle.get("high") for candle in candles if candle.get("high") is not None]
        lows = [candle.get("low") for candle in candles if candle.get("low") is not None]

        if not closes or not volumes or not highs or not lows:
            return JSONResponse(status_code=400, content={"error": "Missing required fields in candles"})

        # Ortalama kapanış fiyatı
        average_close = sum(closes) / len(closes)

        # Ortalama hacim
        average_volume = sum(volumes) / len(volumes)

        # En yüksek ve en düşük fiyat
        highest_price = max(highs)
        lowest_price = min(lows)

        # Trend yönü tespiti
        trend_direction = "Sideways"
        if closes[-1] > closes[0]:
            trend_direction = "Uptrend"
        elif closes[-1] < closes[0]:
            trend_direction = "Downtrend"

        # Trend gücü (basit yüzdelik değişim)
        try:
            trend_strength = round(((closes[-1] - closes[0]) / closes[0]) * 100, 2)
        except ZeroDivisionError:
            trend_strength = 0.0

        return JSONResponse(content={
            "status": "ok",
            "symbol": symbol,
            "interval": interval,
            "candles_count": len(candles),
            "average_close": round(average_close, 2),
            "average_volume": round(average_volume, 2),
            "highest_price": highest_price,
            "lowest_price": lowest_price,
            "trend_direction": trend_direction,
            "trend_strength_percent": trend_strength,
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
