# /app/routers/analyze.py

from fastapi import APIRouter, Request
from typing import List
from pydantic import BaseModel

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

@router.post("/api/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    # Şu anda test için sabit bir yanıt dönüyoruz
    return {
        "status": "ok",
        "symbol": request.symbol,
        "interval": request.interval,
        "candles_count": len(request.candles),
    }
