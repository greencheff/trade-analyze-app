
import pandas as pd
import numpy as np
import talib

def analyze_rsi_divergence_strategy(df):
    close = df['close'].values
    rsi = talib.RSI(close, timeperiod=14)

    df = df.copy()
    df['rsi'] = rsi

    # Dip ve tepe noktaları tespiti (örnek olarak lokal min/max)
    df['price_peak'] = (df['high'] > df['high'].shift(1)) & (df['high'] > df['high'].shift(-1))
    df['price_trough'] = (df['low'] < df['low'].shift(1)) & (df['low'] < df['low'].shift(-1))
    df['rsi_peak'] = (df['rsi'] > df['rsi'].shift(1)) & (df['rsi'] > df['rsi'].shift(-1))
    df['rsi_trough'] = (df['rsi'] < df['rsi'].shift(1)) & (df['rsi'] < df['rsi'].shift(-1))

    # Pozitif uyumsuzluk: fiyat lower low yapıyor ama RSI higher low
    last_two_price_troughs = df[df['price_trough']].tail(2)
    last_two_rsi_troughs = df[df['rsi_trough']].tail(2)

    if len(last_two_price_troughs) == 2 and len(last_two_rsi_troughs) == 2:
        price_divergence = last_two_price_troughs.iloc[1]['low'] < last_two_price_troughs.iloc[0]['low']
        rsi_divergence = last_two_rsi_troughs.iloc[1]['rsi'] > last_two_rsi_troughs.iloc[0]['rsi']
        if price_divergence and rsi_divergence:
            return "Buy"

    # Negatif uyumsuzluk: fiyat higher high yapıyor ama RSI lower high
    last_two_price_peaks = df[df['price_peak']].tail(2)
    last_two_rsi_peaks = df[df['rsi_peak']].tail(2)

    if len(last_two_price_peaks) == 2 and len(last_two_rsi_peaks) == 2:
        price_divergence = last_two_price_peaks.iloc[1]['high'] > last_two_price_peaks.iloc[0]['high']
        rsi_divergence = last_two_rsi_peaks.iloc[1]['rsi'] < last_two_rsi_peaks.iloc[0]['rsi']
        if price_divergence and rsi_divergence:
            return "Sell"

    return "Neutral"
