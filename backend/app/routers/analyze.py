# backend/app/analyze.py

from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
from app.indicators import *
from app.strategy_matcher import run_all_strategies

router = APIRouter()

@router.post("/analyze")
async def analyze_data(data: dict):
    try:
        symbol = data.get("symbol", "BTCUSDT")
        interval = data.get("interval", "1m")
        candles = data.get("candles", [])

        if not candles or len(candles) < 10:
            raise HTTPException(status_code=400, detail="Yetersiz veri: candle datası eksik veya boş.")

        # DataFrame'e çevir
        df = pd.DataFrame(candles, columns=["timestamp", "open", "high", "low", "close", "volume"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)

        # Sayısal alanlar float olsun
        df = df.astype(float)

        # --- İndikatör Hesaplamaları ---
        indicator_results = {}

        try:
            indicator_results["RSI"] = calculate_rsi(df, 14).iloc[-1]
            indicator_results["MACD"] = calculate_macd(df)[0].iloc[-1]
            indicator_results["ADX"] = calculate_adx(df, 14).iloc[-1]
            indicator_results["Trend Strength %"] = trend_strength_percent(df, 14).iloc[-1]
            indicator_results["Kapanış Ortalaması"] = average_close(df).iloc[-1]
            indicator_results["İşlem Hacmi Ortalaması"] = average_volume(df).iloc[-1]
        except Exception as e:
            print(f"İndikatör hesaplama hatası: {e}")
            raise HTTPException(status_code=500, detail=f"İndikatör hesaplama hatası: {str(e)}")

        # --- Trend Yönü Belirleme ---
        try:
            if indicator_results["Trend Strength %"] >= 65:
                trend_yonu = "Yukarı"
            elif indicator_results["Trend Strength %"] <= 35:
                trend_yonu = "Aşağı"
            else:
                trend_yonu = "Yatay"
        except:
            trend_yonu = "Bilinmiyor"

        # --- Strateji Önerileri ---
        try:
            strateji_onerileri = run_all_strategies(df)
        except Exception as e:
            print(f"Strateji hesaplama hatası: {e}")
            strateji_onerileri = []

        # Sonuç
        result = {
            "symbol": symbol,
            "interval": interval,
            "trend_yonu": trend_yonu,
            "rsi": round(indicator_results["RSI"], 2),
            "macd": round(indicator_results["MACD"], 2) if pd.notna(indicator_results["MACD"]) else None,
            "adx": round(indicator_results["ADX"], 2),
            "trend_strength": round(indicator_results["Trend Strength %"], 2),
            "average_close": round(indicator_results["Kapanış Ortalaması"], 2),
            "average_volume": round(indicator_results["İşlem Hacmi Ortalaması"], 2),
            "strateji_onerileri": strateji_onerileri
        }

        return result

    except Exception as e:
        print(f"Genel analiz hatası: {e}")
        raise HTTPException(status_code=500, detail=f"Genel analiz hatası: {str(e)}")
