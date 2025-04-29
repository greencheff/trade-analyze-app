import pandas as pd
import pandas_ta as ta
import numpy as np
from app.indicators import calculate_adx, calculate_rsi

def analyze_rsi_divergence_strategy(df: pd.DataFrame) -> str:
    df = df.copy()
    df['rsi'] = ta.rsi(df['close'], length=14)

    # fiyat dip/tepe ve RSI dip/tepe
    df['price_trough'] = (df['low'] < df['low'].rolling(window=5, center=True).min())
    df['price_peak']   = (df['high'] > df['high'].rolling(window=5, center=True).max())
    df['rsi_trough']   = (df['rsi'] < df['rsi'].rolling(window=5, center=True).min())
    df['rsi_peak']     = (df['rsi'] > df['rsi'].rolling(window=5, center=True).max())

    # Bullish Divergence
    bullish = (
        df['price_trough'] &
        df['rsi_trough'].shift(1) &
        (df['low'] < df['low'].shift(1)) &
        (df['rsi'] > df['rsi'].shift(1) + 2)
    )
    if bullish.iloc[-1]:
        return "Buy"

    # Bearish Divergence
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
    """
    Multi Timeframe Trend Onayı:
    ADX > 25 + RSI üzerinden 50’e bakabilirsiniz.
    """
    adx = calculate_adx(df, period=14).iloc[-1]
    rsi = calculate_rsi(df, period=14).iloc[-1]

    if adx > 25 and rsi > 50:
        return "Buy"
    if adx > 25 and rsi < 50:
        return "Sell"
    return "Neutral"

def analyze_orderblock_rsi_divergence_strategy(df: pd.DataFrame) -> str:
    """
    Orderblock + RSI Diverjans:
    Şimdilik sadece RSI Diverjans sinyalini döndürüyor,
    buraya orderblock tespiti ekle.
    """
    return analyze_rsi_divergence_strategy(df)

def analyze_bollinger_breakout_strategy(df: pd.DataFrame) -> str:
    """
    Bollinger Bandı kırılımı:
    Üst banda çıkış -> Buy, alt banda düşüş -> Sell
    """
    df = df.copy()
    bb = ta.bbands(df['close'], length=20, std=2)
    df['bb_upper'] = bb[f'BBU_20_2.0']
    df['bb_lower'] = bb[f'BBL_20_2.0']

    if df['close'].iloc[-1] > df['bb_upper'].iloc[-1]:
        return "Buy"
    if df['close'].iloc[-1] < df['bb_lower'].iloc[-1]:
        return "Sell"
    return "Neutral"

def analyze_breakout_volume_strategy(df: pd.DataFrame) -> str:
    """
    Fiyat kırılım + hacim onayı:
    Son kapanış bir önceki high’ı kırdıysa ve
    hacim 20 periyot ortalamasının üzerindeyse Buy, tersi Sell.
    """
    df = df.copy()
    vol_ma = df['volume'].rolling(window=20).mean()
    if (df['close'].iloc[-1] > df['high'].shift(1).iloc[-1] and
        df['volume'].iloc[-1] > vol_ma.iloc[-1]):
        return "Buy"
    if (df['close'].iloc[-1] < df['low'].shift(1).iloc[-1] and
        df['volume'].iloc[-1] > vol_ma.iloc[-1]):
        return "Sell"
    return "Neutral"
