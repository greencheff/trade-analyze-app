from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import pandas as pd

from app.indicators import (
    calculate_rsi,
    calculate_macd,
    calculate_ema,
    calculate_bollinger_bands,
    calculate_atr,
    calculate_stochastic_rsi,
    calculate_adx,
    calculate_cci,
    calculate_vwap,
    calculate_obv,
)

from app.strategy_matcher import (
    momentum_long_signal,
    mean_reversion_short_signal,
    trend_following_long_signal,
    volatility_breakout_signal,
    stochastic_rsi_reversal_signal,
    adx_trend_strength_signal,
    cci_reversal_signal,
    vwap_trend_follow_signal,
    obv_breakout_signal,
    macd_zero_cross_signal,
)

router = APIRouter()

def run_all_strategies(df):
    strategies = []
    all_strategies = {
        "Momentum Long": momentum_long_signal,
        "Mean Reversion Short": mean_reversion_short_signal,
        "Trend Following Long": trend_following_long_signal,
        "Volatility Breakout": volatility_breakout_signal,
        "Stochastic RSI Reversal": stochastic_rsi_reversal_signal,
        "ADX Trend Strength": adx_trend_strength_signal,
        "CCI Reversal": cci_reversal_signal,
        "VWAP Trend Follow": vwap_trend_follow_signal,
        "OBV Breakout": obv_breakout_signal,
        "MACD Zero Cross": macd_zero_cross_signal,
    }
    for name, func in all_strategies.items():
        try:
            result, explanation = func(df)
            strategies.append({
                "name": name,
                "signal": bool(result),
                "explanation": str(explanation)
            })
        except Exception as e:
            strategies.append({
                "name": name,
                "signal": False,
                "explanation": f"Hata: {str(e)}"
            })
    return strategies

@router.post("/api/analyze")
async def analyze_data(request: Request):
    try:
        data = await request.json()
        candles = data.get("candles", [])

        if not candles or not isinstance(candles, list):
            return JSONResponse(status_code=400, content={"error": "Invalid candle data"})

        df = pd.DataFrame(candles)

        if df.empty or not all(col in df.columns for col in ["open", "high", "low", "close", "volume"]):
            return JSONResponse(status_code=400, content={"error": "Missing required fields in candles"})

        closes = df['close'].tolist()
        volumes = df['volume'].tolist()
        highs = df['high'].tolist()
        lows = df['low'].tolist()

        average_close = round(sum(closes) / len(closes), 2)
        average_volume = round(sum(volumes) / len(volumes), 2)
        highest_price = max(highs)
        lowest_price = min(lows)

        trend_direction = "Sideways"
        if closes[-1] > closes[0]:
            trend_direction = "Uptrend"
        elif closes[-1] < closes[0]:
            trend_direction = "Downtrend"

        try:
            trend_strength = round(((closes[-1] - closes[0]) / closes[0]) * 100, 2)
        except ZeroDivisionError:
            trend_strength = 0.0

        rsi_value = round(calculate_rsi(df, period=14).iloc[-1], 2)
        ema_value = round(calculate_ema(df, period=14).iloc[-1], 2)
        macd_value = round(calculate_macd(df)[0].iloc[-1], 2)
        stochastic_k_value = round(calculate_stochastic_rsi(df).iloc[-1], 2)
        adx_value = round(calculate_adx(df).iloc[-1], 2)

        strategy_results = run_all_strategies(df)

        # Burada detaylı açıklama oluşturuyoruz
        details = []

        if rsi_value > 70:
            details.append(f"RSI {rsi_value} (Aşırı Alım) → Düzeltme gelebilir.")
        elif rsi_value < 30:
            details.append(f"RSI {rsi_value} (Aşırı Satım) → Alım fırsatı olabilir.")
        else:
            details.append(f"RSI {rsi_value} (Nötr seviyede).")

        if macd_value > 0:
            details.append(f"MACD pozitif ({macd_value}), trend yukarı.")
        else:
            details.append(f"MACD negatif ({macd_value}), trend aşağı.")

        detailed_analysis = " ".join(details)

        return JSONResponse(content={
            "status": "ok",
            "candles_count": len(candles),
            "analysis": {
                "average_close": average_close,
                "average_volume": average_volume,
                "highest_price": highest_price,
                "lowest_price": lowest_price,
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength,
                "rsi_value": rsi_value,
                "ema_value": ema_value,
                "macd_value": macd_value,
                "stochastic_k_value": stochastic_k_value,
                "adx_value": adx_value,
                "detailed_analysis": detailed_analysis  # burada frontend için detaylı yorum veriyoruz
            },
            "strategies": strategy_results
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
