# backend/app/routers/analyze.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np

router = APIRouter()

# --- Request Body için Pydantic Modeli ---
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

# --- Analiz Fonksiyonları ---
def calculate_rsi(prices: List[float], period: int = 14) -> float:
    if len(prices) < period:
        return 50.0  # Yetersiz veri varsa nötr RSI dön
    deltas = np.diff(prices)
    seed = deltas[:period]
    up = seed[seed > 0].sum() / period
    down = -seed[seed < 0].sum() / period
    rs = up / down if down != 0 else 0
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(prices: List[float]) -> float:
    exp1 = np.array(prices[-12:]).mean()
    exp2 = np.array(prices[-26:]).mean()
    return exp1 - exp2

# --- API Endpoint ---
@router.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    closes = [candle.close for candle in request.candles]

    if len(closes) < 26:
        raise HTTPException(status_code=400, detail="Yetersiz mum verisi gönderildi.")

    rsi = calculate_rsi(closes)
    macd = calculate_macd(closes)

    # Basit Strateji Kuralları
    if rsi < 30 and macd > 0:
        feedback = "Momentum Long Sinyali: RSI düşük, MACD pozitif."
    elif rsi > 70 and macd < 0:
        feedback = "Momentum Short Sinyali: RSI yüksek, MACD negatif."
    else:
        feedback = "Belirgin bir trade sinyali yok."

    return {
        "symbol": request.symbol,
        "interval": request.interval,
        "rsi": round(rsi, 2),
        "macd": round(macd, 2),
        "feedback": feedback
    }
