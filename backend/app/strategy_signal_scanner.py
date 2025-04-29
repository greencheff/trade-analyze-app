import pandas as pd
import pandas_ta as ta
import numpy as np
from app.indicators import calculate_adx, calculate_rsi, calculate_pivot_points

def analyze_rsi_divergence_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    df['rsi'] = ta.rsi(df['close'], length=14)
    df['price_trough'] = (df['low'] < df['low'].rolling(5, center=True).min())
    df['price_peak']   = (df['high'] > df['high'].rolling(5, center=True).max())
    df['rsi_trough']   = (df['rsi'] < df['rsi'].rolling(5, center=True).min())
    df['rsi_peak']     = (df['rsi'] > df['rsi'].rolling(5, center=True).max())

    bullish = (
        df['price_trough'] &
        df['rsi_trough'].shift(1) &
        (df['low'] < df['low'].shift(1)) &
        (df['rsi'] > df['rsi'].shift(1) + 2)
    )
    if bullish.iloc[-1]:
        return "Buy"

    bearish = (
        df['price_peak'] &
        df['rsi_peak'].shift(1) &
        (df['high'] > df['high'].shift(1)) &
        (df['rsi'] < df['rsi'].shift(1) - 2)
    )
    if bearish.iloc[-1]:
        return "Sell"

    return "Neutral"

def analyze_mtf_confirmation_strategy(df: pd.DataFrame) -> str:
    adx = calculate_adx(df, period=14).iloc[-1]
    rsi = calculate_rsi(df, period=14).iloc[-1]
    if adx > 25 and rsi > 50:
        return "Buy"
    if adx > 25 and rsi < 50:
        return "Sell"
    return "Neutral"

def analyze_orderblock_rsi_divergence_strategy(df: pd.DataFrame) -> str:
    # TODO: Orderblock logic ekle; şimdilik RSI Diverjans sonuçunu döndürüyor
    return analyze_rsi_divergence_strategy(df)

def analyze_bollinger_breakout_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    bb = ta.bbands(df['close'], length=20, std=2)
    df['bb_upper'] = bb['BBU_20_2.0']
    df['bb_lower'] = bb['BBL_20_2.0']
    if df['close'].iloc[-1] > df['bb_upper'].iloc[-1]:
        return "Buy"
    if df['close'].iloc[-1] < df['bb_lower'].iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_breakout_volume_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    vol_ma = df['volume'].rolling(20).mean()
    if df['close'].iloc[-1] > df['high'].shift(1).iloc[-1] and df['volume'].iloc[-1] > vol_ma.iloc[-1]:
        return "Buy"
    if df['close'].iloc[-1] < df['low'].shift(1).iloc[-1] and df['volume'].iloc[-1] > vol_ma.iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_ema_ribbon_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    ema_short = ta.ema(df['close'], length=10)
    ema_long  = ta.ema(df['close'], length=20)
    if df['close'].iloc[-1] > ema_short.iloc[-1] > ema_long.iloc[-1]:
        return "Buy"
    if df['close'].iloc[-1] < ema_short.iloc[-1] < ema_long.iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_stochastic_rsi_momentum_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    stoch = ta.stochrsi(df['close'], length=14)
    k = stoch['STOCHRSIk_14_14_3_3']
    if k.iloc[-1] < 20:
        return "Buy"
    if k.iloc[-1] > 80:
        return "Sell"
    return "Neutral"

def analyze_keltner_breakout_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    kc = ta.kc(df['high'], df['low'], df['close'], length=20, scalar=2)
    df['kc_upper'] = kc['KCU_20_2.0']
    df['kc_lower'] = kc['KCL_20_2.0']
    if df['close'].iloc[-1] > df['kc_upper'].iloc[-1]:
        return "Buy"
    if df['close'].iloc[-1] < df['kc_lower'].iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_pivot_point_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    pivot, s1, r1, s2, r2 = calculate_pivot_points(df)
    if df['close'].iloc[-1] > r1.iloc[-1]:
        return "Buy"
    if df['close'].iloc[-1] < s1.iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_liquidity_sweep_bos_strategy(df: pd.DataFrame) -> str:
    # TODO: Liquidity Sweep + BOS logic ekle
    return "Neutral"
