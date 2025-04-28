# backend/app/routes/analyze.py

from fastapi import APIRouter, Request, HTTPException
import pandas as pd
from app.indicators import *
from app.strategy_matcher import run_all_strategies

router = APIRouter()

@router.post("/analyze")
async def analyze_data(request: Request):
    try:
        body = await request.json()
        candles = body.get("candles", [])

        if not candles or not isinstance(candles, list):
            raise HTTPException(status_code=400, detail="Gönderilen candle verisi eksik veya hatalı.")

        # Veriyi DataFrame'e çevir
        df = pd.DataFrame(candles, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df.astype(float)

        # İndikatör hesaplamaları
        indicator_values = {}

        try:
            indicator_values["rsi"] = calculate_rsi(df, 14).iloc[-1]
            indicator_values["macd"] = calculate_macd(df)[0].iloc[-1]
            indicator_values["adx"] = calculate_adx(df, 14).iloc[-1]
            indicator_values["trend_strength"] = trend_strength_percent(df, 14).iloc[-1]
            indicator_values["average_close"] = average_close(df).iloc[-1]
            indicator_values["average_volume"] = average_volume(df).iloc[-1]
        except Exception as e:
            print(f"İndikatör hesaplama hatası: {e}")
            raise HTTPException(status_code=500, detail=f"İndikatör hesaplama hatası: {str(e)}")

        trend_direction = "Yatay"
        if indicator_values["trend_strength"] >= 65:
            trend_direction = "Yukarı"
        elif indicator_values["trend_strength"] <= 35:
            trend_direction = "Aşağı"

        # Strateji hesaplamaları
        try:
            strategies = run_all_strategies(df)
        except Exception as e:
            print(f"Strateji hesaplama hatası: {e}")
            strategies = []

        return {
            "status": "ok",
            "summary": {
                "average_close": indicator_values["average_close"],
                "average_volume": indicator_values["average_volume"],
                "trend_direction": trend_direction,
                "trend_strength_percent": indicator_values["trend_strength"],
                "detailed_analysis": "İndikatörlere göre piyasa yorumu tamamlandı."
            },
            "indicator_values": indicator_values,
            "strategies": strategies
        }

    except Exception as e:
        print(f"Genel analiz hatası: {e}")
        raise HTTPException(status_code=500, detail=f"Genel analiz hatası: {str(e)}")
