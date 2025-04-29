import traceback
from fastapi import APIRouter, Request, HTTPException
import pandas as pd
from app import indicators
from app.strategy_matcher import run_all_strategies

router = APIRouter()

@router.get("/indicators")
async def get_indicators():
    """Tüm indikatör fonksiyon isimlerini döner"""
    all_funcs = [name for name in dir(indicators) if callable(getattr(indicators, name)) and not name.startswith("__")]
    return {"indicators": all_funcs}

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
        for name in dir(indicators):
            obj = getattr(indicators, name)
            if callable(obj) and not name.startswith("__"):
                try:
                    result = obj(df)
                    if hasattr(result, "iloc"):
                        indicator_values[name] = result.iloc[-1]
                    else:
                        indicator_values[name] = result
                except Exception:
                    continue

        trend_strength = indicator_values.get("trend_strength_percent", 50)
        if trend_strength >= 65:
            trend_direction = "Yukarı"
        elif trend_strength <= 35:
            trend_direction = "Aşağı"
        else:
            trend_direction = "Yatay"

        try:
            strategies = run_all_strategies(df)
        except Exception:
            strategies = []

        return {
            "status": "ok",
            "summary": {
                "average_close": indicator_values.get("average_close", 0),
                "average_volume": indicator_values.get("average_volume", 0),
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength,
                "detailed_analysis": "ADX + RSI + MACD kombinasyonu, neredeyse tüm piyasa koşullarında dengeli ve güvenilir sinyaller üretir."
            },
            "indicator_values": indicator_values,
            "strategies": strategies
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Genel analiz hatası: {e}")
@router.post("/single-indicator")
async def analyze_single_indicator(request: Request):
    try:
        body = await request.json()
        candles = body.get("candles", [])
        selected_indicator = body.get("selectedIndicator", None)

        if not candles or not isinstance(candles, list):
            raise HTTPException(400, "Gönderilen candle verisi eksik veya hatalı.")
        if not selected_indicator:
            raise HTTPException(400, "Seçilen indikatör eksik.")

        df = pd.DataFrame(candles, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df.astype(float)

        obj = getattr(indicators, selected_indicator, None)
        if not obj or not callable(obj):
            raise HTTPException(400, "Geçersiz veya desteklenmeyen indikatör seçimi.")

        try:
            result = obj(df)
            if hasattr(result, "iloc"):
                result_value = result.iloc[-1]
            else:
                result_value = result
        except Exception as e:
            raise HTTPException(500, f"İndikatör hesaplama hatası: {str(e)}")

        return {
            "status": "ok",
            "indicator": selected_indicator,
            "value": float(result_value)
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Genel analiz hatası: {e}")
