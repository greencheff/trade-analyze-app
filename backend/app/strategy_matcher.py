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

# --- Strategy Signals ---

def momentum_long_signal(df):
    rsi = calculate_rsi(df, period=14).iloc[-1]
    macd, signal_line, histogram = calculate_macd(df)
    macd_value = macd.iloc[-1]

    signal = rsi < 30 and macd_value > 0
    explanation = f"RSI: {rsi:.2f} (<30) ve MACD: {macd_value:.2f} (>0) - {'AL' if signal else 'BEKLE'}"
    return signal, explanation

def mean_reversion_short_signal(df):
    upper_band, lower_band = calculate_bollinger_bands(df)
    close = df['close'].iloc[-1]

    signal = close > upper_band.iloc[-1]
    explanation = f"Close: {close:.2f} > Upper Band: {upper_band.iloc[-1]:.2f} - {'SAT' if signal else 'BEKLE'}"
    return signal, explanation

def trend_following_long_signal(df):
    ema20 = calculate_ema(df, period=20)
    ema50 = calculate_ema(df, period=50)

    signal = ema20.iloc[-1] > ema50.iloc[-1]
    explanation = f"EMA20: {ema20.iloc[-1]:.2f} > EMA50: {ema50.iloc[-1]:.2f} - {'TREND AL' if signal else 'BEKLE'}"
    return signal, explanation

def volatility_breakout_signal(df):
    atr = calculate_atr(df, period=14)
    high = df['high'].iloc[-1]
    low = df['low'].iloc[-1]

    signal = (high - low) > atr.iloc[-1]
    explanation = f"Range: {high - low:.2f} > ATR: {atr.iloc[-1]:.2f} - {'VOLATILITE BREAKOUT' if signal else 'BEKLE'}"
    return signal, explanation

def stochastic_rsi_reversal_signal(df):
    stoch_rsi = calculate_stochastic_rsi(df).iloc[-1]

    signal = stoch_rsi < 20
    explanation = f"Stochastic RSI: {stoch_rsi:.2f} (<20) - {'AL' if signal else 'BEKLE'}"
    return signal, explanation

def adx_trend_strength_signal(df):
    adx = calculate_adx(df).iloc[-1]

    signal = adx > 25
    explanation = f"ADX: {adx:.2f} (>25) - {'GÜÇLÜ TREND' if signal else 'ZAYIF TREND'}"
    return signal, explanation

def cci_reversal_signal(df):
    cci = calculate_cci(df).iloc[-1]

    signal = cci < -100
    explanation = f"CCI: {cci:.2f} (<-100) - {'DİP DÖNÜŞ AL' if signal else 'BEKLE'}"
    return signal, explanation

def vwap_trend_follow_signal(df):
    vwap = calculate_vwap(df).iloc[-1]
    close = df['close'].iloc[-1]

    signal = close > vwap
    explanation = f"Close: {close:.2f} > VWAP: {vwap:.2f} - {'TREND AL' if signal else 'BEKLE'}"
    return signal, explanation

def obv_breakout_signal(df):
    obv = calculate_obv(df)

    signal = obv.iloc[-1] > obv.iloc[-2]
    explanation = f"OBV: {obv.iloc[-2]:.2f} -> {obv.iloc[-1]:.2f} - {'HACİM YÜKSELİŞİ' if signal else 'HACİM ZAYIF'}"
    return signal, explanation

def macd_zero_cross_signal(df):
    macd, signal_line, histogram = calculate_macd(df)

    signal = macd.iloc[-2] < 0 and macd.iloc[-1] > 0
    explanation = f"MACD: {macd.iloc[-2]:.2f} -> {macd.iloc[-1]:.2f} - {'SIFIR ÜSTÜNE ÇIKIŞ' if signal else 'BEKLE'}"
    return signal, explanation
