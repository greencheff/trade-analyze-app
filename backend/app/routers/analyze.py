import traceback
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
            raise HTTPException(400, "Gönderilen candle verisi eksik veya hatalı.")

        df = pd.DataFrame(candles, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df.astype(float)

        indicator_values = {}
        try:
            indicator_values["rsi"]             = calculate_rsi(df, 14).iloc[-1]
            indicator_values["macd"]            = calculate_macd(df)[0].iloc[-1]
            indicator_values["adx"]             = calculate_adx(df, 14).iloc[-1]
            indicator_values["trend_strength"]  = trend_strength_percent(df, 14).iloc[-1]
            indicator_values["average_close"]   = average_close(df).iloc[-1]
            indicator_values["average_volume"]  = average_volume(df).iloc[-1]
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(500, f"İndikatör hesaplama hatası: {e}")

        trend_strength = indicator_values["trend_strength"]
        if trend_strength >= 65:
            trend_direction = "Yukarı"
        elif trend_strength <= 35:
            trend_direction = "Aşağı"
        else:
            trend_direction = "Yatay"

        try:
            strategies = run_all_strategies(df)
        except Exception as e:
            traceback.print_exc()
            strategies = []

        return {
            "status": "ok",
            "summary": {
                "average_close": indicator_values["average_close"],
                "average_volume": indicator_values["average_volume"],
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength,
                "detailed_analysis": "ADX + RSI + MACD kombinasyonu, neredeyse tüm piyasa koşullarında dengeli ve güvenilir sinyaller üretir."
            },
            "indicator_values": indicator_values,
            "strategies": strategies,
            "candles": candles  # 🔵 Ekledik: frontend için candles'ı da dönüyoruz
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Genel analiz hatası: {e}")

# 📌 Burası güncellendi: Seçili indikatör analizi için
@router.post("/single-indicator")
async def analyze_single_indicator(request: Request):
    try:
        body = await request.json()
        candles = body.get("candles", [])
        selected_indicator = body.get("selectedIndicator", "")

        if not selected_indicator:
            raise HTTPException(400, "İndikatör seçimi eksik.")

        if not candles or not isinstance(candles, list):
            raise HTTPException(400, "Candle verisi eksik veya hatalı.")

        df = pd.DataFrame(candles, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df.astype(float)

        indicator_function = getattr(__import__('app.indicators', fromlist=[selected_indicator]), selected_indicator, None)

        if not indicator_function:
            raise HTTPException(404, "İndikatör bulunamadı.")

        value = indicator_function(df).iloc[-1]

        return {"value": value}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"İndikatör analizi hatası: {e}")
