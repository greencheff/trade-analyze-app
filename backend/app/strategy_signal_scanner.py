import pandas as pd
import pandas_ta as ta
import numpy as np
from app.indicators import calculate_adx, calculate_rsi, calculate_ribbon_moving_average, calculate_keltner_channel

# (varolan fonksiyonlar...)

def analyze_ema_ribbon_trend_strategy(df: pd.DataFrame) -> str:
    # EMA Ribbon Trend Sistemi: close, tüm EMA'ların üzerinde ise Buy, altında ise Sell
    ribbon = calculate_ribbon_moving_average(df, periods=[10,20,30,40,50])
    last = df['close'].iloc[-1]
    if (last > ribbon.max(axis=1).iloc[-1]):
        return "Buy"
    if (last < ribbon.min(axis=1).iloc[-1]):
        return "Sell"
    return "Neutral"

def analyze_stochastic_rsi_momentum_strategy(df: pd.DataFrame) -> str:
    # Stochastic RSI Momentum: Hızlı momentum değişimlerinde oversold/overbought
    stoch_rsi = ta.stochrsi(df['close'], length=14)
    k = stoch_rsi['STOCHRSIk_14_14_3_3']
    d = stoch_rsi['STOCHRSId_14_14_3_3']
    if k.iloc[-1] > 80 and d.iloc[-1] > 80:
        return "Sell"
    if k.iloc[-1] < 20 and d.iloc[-1] < 20:
        return "Buy"
    return "Neutral"

def analyze_keltner_channel_breakout_strategy(df: pd.DataFrame) -> str:
    # Keltner Channel Breakout
    upper, lower = calculate_keltner_channel(df, period=20, multiplier=2)
    last = df['close'].iloc[-1]
    if last > upper.iloc[-1]:
        return "Buy"
    if last < lower.iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_pivot_point_strategy(df: pd.DataFrame) -> str:
    # Pivot Noktası Stratejisi
    pivot, s1, r1, s2, r2 = calculate_pivot_points(df)
    last = df['close'].iloc[-1]
    if last > pivot.iloc[-1]:
        return "Buy"
    if last < pivot.iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_liquidity_sweep_bos_strategy(df: pd.DataFrame) -> str:
    # Liquidity Sweep + BOS: son candle hacim ve fiyat kırılımı
    vol_ma = df['volume'].rolling(window=20).mean()
    last_close = df['close'].iloc[-1]
    prev_high = df['high'].shift(1).iloc[-1]
    prev_low = df['low'].shift(1).iloc[-1]
    last_vol = df['volume'].iloc[-1]
    if last_close > prev_high and last_vol > vol_ma.iloc[-1]:
        return "Buy"
    if last_close < prev_low and last_vol > vol_ma.iloc[-1]:
        return "Sell"
    return "Neutral"
