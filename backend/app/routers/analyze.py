# analyze.py

from fastapi import APIRouter, Request, HTTPException
import pandas as pd
import inspect
from app.indicators import *
from app.strategy_matcher import run_all_strategies

router = APIRouter()

def compute_indicators(df):
    indicator_values = {}

    for name, func in globals().items():
        if callable(func) and name.startswith("calculate_"):
            try:
                sig = inspect.signature(func)
                params = sig.parameters

                if len(params) == 1 or 'df' in params:
                    result = func(df)
                else:
                    continue

                if isinstance(result, tuple):
                    for idx, value in enumerate(result):
                        if hasattr(value, 'iloc'):
                            indicator_values[f"{name}_{idx}"] = float(value.iloc[-1])
                        else:
                            indicator_values[f"{name}_{idx}"] = float(value)
                elif hasattr(result, 'iloc'):
                    indicator_values[name] = float(result.iloc[-1])
                else:
                    indicator_values[name] = float(result)

            except Exception as e:
                print(f"İndikatör çalıştırılamadı: {name} -> {e}")
                continue

    return indicator_values

@router.post("/api/analyze")
async def analyze(request: Request):
    try:
        body = await request.json()
        candles = body.get("candles")

        if not candles or not isinstance(candles, list):
            raise HTTPException(status_code=400, detail="Gönderilen veride 'candles' listesi eksik veya hatalı.")

        df = pd.DataFrame(candles)

        required_columns = {'open', 'high', 'low', 'close', 'volume'}
        if not required_columns.issubset(df.columns):
            raise HTTPException(status_code=400, detail="Gönderilen verilerde 'open', 'high', 'low', 'close', 'volume' kolonları eksik.")

        indicator_values = compute_indicators(df)
        strategies = run_all_strategies(df)

        trend_strength_percent = indicator_values.get('trend_strength_percent', 50)

        if trend_strength_percent > 60:
            trend_direction = "Yukarı"
        elif trend_strength_percent < 40:
            trend_direction = "Aşağı"
        else:
            trend_direction = "Yatay"

        return {
            "status": "ok",
            "candles_count": len(candles),
            "summary": {
                "average_close": indicator_values.get("average_close"),
                "average_volume": indicator_values.get("average_volume"),
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength_percent,
                "detailed_analysis": "İndikatörlere göre genel piyasa analizi yapılmıştır."
            },
            "indicator_values": indicator_values,
            "strategies": strategies
        }

    except Exception as e:
        print(f"Sunucu tarafı hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sunucu tarafında hata oluştu: {str(e)}")
