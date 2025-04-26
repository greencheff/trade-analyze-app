from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Candle(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: float

class AnalyzeRequest(BaseModel):
    symbol: str
    interval: str
    candles: List[Candle]

@router.post("/analyze")
async def analyze_data(request: AnalyzeRequest):
    try:
        # Şu anlık temel bir kontrol yapıyoruz (örneğin mum sayısını kontrol et)
        if len(request.candles) < 2:
            raise HTTPException(status_code=400, detail="Yeterli mum verisi yok.")

        last_candle = request.candles[-1]
        previous_candle = request.candles[-2]

        feedback = []

        # Basit bir örnek analiz: son kapanış önceki açılıştan yüksekse
        if last_candle.close > previous_candle.open:
            feedback.append({
                "event_id": "trend_up",
                "summary": "Fiyat artışı gözlendi.",
                "score": 1,
                "symbol": request.symbol,
                "interval": request.interval,
                "macd": "positive",
                "rsi": "strong"
            })
        else:
            feedback.append({
                "event_id": "trend_down",
                "summary": "Fiyat düşüşü gözlendi.",
                "score": -1,
                "symbol": request.symbol,
                "interval": request.interval,
                "macd": "negative",
                "rsi": "weak"
            })

        return {"status": "ok", "feedback": feedback}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
