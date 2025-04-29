
import traceback
from fastapi import APIRouter, Request, HTTPException
import pandas as pd
from app.indicators import (
    average_close,
    average_volume,
    calculate_accumulation_distribution,
    calculate_advance_decline_ratio,
    calculate_adx,
)
from app.strategy_matcher import run_all_strategies

router = APIRouter()

@router.post("/analyze")
async def analyze_data(request: Request):
    try:
        body = await request.json()
        candles = body.get("candles", [])
        if not candles or not isinstance(candles, list):
            raise HTTPException(400, "Gönderilen candle verisi eksik veya hatalı.")

        df = pd.DataFrame(candles, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df.astype(float)

        indicator_values = {}
        try:
            indicator_values["average_close"] = average_close(df).iloc[-1]
            indicator_values["average_volume"] = average_volume(df).iloc[-1]
            indicator_values["accumulation_distribution"] = calculate_accumulation_distribution(df).iloc[-1]
            indicator_values["advance_decline_ratio"] = calculate_advance_decline_ratio(df).iloc[-1]
            indicator_values["adx"] = calculate_adx(df, 14).iloc[-1]
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(500, f"İndikatör hesaplama hatası: {e}")

        trend_strength = indicator_values.get("adx", 0)
        if trend_strength >= 65:
            trend_direction = "Yukarı"
        elif trend_strength <= 35:
            trend_direction = "Aşağı"
        else:
            trend_direction = "Yatay"

        strategies = []
        try:
            strategies = run_all_strategies(df)
        except Exception as e:
            traceback.print_exc()

        return {
            "status": "ok",
            "summary": {
                "average_close": indicator_values.get("average_close"),
                "average_volume": indicator_values.get("average_volume"),
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength,
                "detailed_analysis": "İndikatörlere göre piyasa yorumu tamamlandı."
            },
            "indicator_values": indicator_values,
            "strategies": strategies
        }
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Genel analiz hatası: {e}")
