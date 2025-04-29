
import pandas as pd
import pandas_ta as ta

def analyze_rsi_divergence_strategy(df):
    import numpy as np
    df = df.copy()
    df['rsi'] = ta.rsi(df['close'], length=14)

    # RSI dip ve tepe noktalarının belirlenmesi için rolling min/max
    df['price_trough'] = (df['low'] < df['low'].rolling(window=5, center=True).min())
    df['price_peak'] = (df['high'] > df['high'].rolling(window=5, center=True).max())
    df['rsi_trough'] = (df['rsi'] < df['rsi'].rolling(window=5, center=True).min())
    df['rsi_peak'] = (df['rsi'] > df['rsi'].rolling(window=5, center=True).max())

    # Pozitif uyumsuzluk (Bullish Divergence)
    bullish = (
        df['price_trough'] &
        df['rsi_trough'].shift(1) &
        (df['low'] < df['low'].shift(1)) &
        (df['rsi'] > df['rsi'].shift(1) + 2)  # tolerans ekledik
    )

    if bullish.iloc[-1]:
        return "Buy"

    # Negatif uyumsuzluk (Bearish Divergence)
    bearish = (
        df['price_peak'] &
        df['rsi_peak'].shift(1) &
        (df['high'] > df['high'].shift(1)) &
        (df['rsi'] < df['rsi'].shift(1) - 2)  # tolerans ekledik
    )

    if bearish.iloc[-1]:
        return "Sell"

    return "Neutral"
