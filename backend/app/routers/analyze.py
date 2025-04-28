from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import pandas as pd
import inspect

# Import all indicators
from app import indicators

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

def compute_indicators(df: pd.DataFrame):
    """
    Dynamically compute all calculate_* indicators that accept a single DataFrame argument.
    Skip functions requiring additional mandatory parameters.
    """
    results = {}
    for name, func in inspect.getmembers(indicators, inspect.isfunction):
        if name.startswith("calculate_"):
            try:
                output = func(df)
            except TypeError:
                # skip functions that require additional parameters
                continue

            # Handle different output types
            if isinstance(output, pd.Series):
                results[name] = round(output.iloc[-1], 6)
            elif isinstance(output, tuple):
                vals = []
                for item in output:
                    if isinstance(item, pd.Series):
                        vals.append(round(item.iloc[-1], 6))
                    else:
                        vals.append(item)
                results[name] = vals
            elif isinstance(output, pd.DataFrame):
                results[name] = output.iloc[-1].to_dict()
            else:
                results[name] = output
    return results

@router.post("/api/analyze")
async def analyze_data(request: Request):
    try:
        data = await request.json()
        candles = data.get("candles", [])

        if not candles or not isinstance(candles, list):
            return JSONResponse(status_code=400, content={"error": "Invalid candle data"})

        df = pd.DataFrame(candles)
        required_cols = {"open", "high", "low", "close", "volume"}
        if df.empty or not required_cols.issubset(df.columns):
            return JSONResponse(status_code=400, content={"error": "Missing required fields in candles"})

        # Basic summary
        average_close = round(df['close'].mean(), 2)
        average_volume = round(df['volume'].mean(), 2)
        highest_price = df['high'].max()
        lowest_price = df['low'].min()
        trend_direction = "Sideways"
        if df['close'].iloc[-1] > df['close'].iloc[0]:
            trend_direction = "Uptrend"
        elif df['close'].iloc[-1] < df['close'].iloc[0]:
            trend_direction = "Downtrend"
        try:
            trend_strength = round(((df['close'].iloc[-1] - df['close'].iloc[0]) / df['close'].iloc[0]) * 100, 2)
        except ZeroDivisionError:
            trend_strength = 0.0

        # Compute all indicators dynamically
        indicator_values = compute_indicators(df)

        # Run strategy signals
        strategy_results = run_all_strategies(df)

        return JSONResponse(content={
            "status": "ok",
            "candles_count": len(candles),
            "summary": {
                "average_close": average_close,
                "average_volume": average_volume,
                "highest_price": highest_price,
                "lowest_price": lowest_price,
                "trend_direction": trend_direction,
                "trend_strength_percent": trend_strength
            },
            "indicator_values": indicator_values,
            "strategies": strategy_results
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
