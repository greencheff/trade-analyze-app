from indicators import (
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
    rsi = calculate_rsi(df, period=14)
    macd, signal_line, histogram = calculate_macd(df)
    ema20 = calculate_ema(df, period=20)
    ema50 = calculate_ema(df, period=50)

    last_rsi = rsi.iloc[-1]
    last_histogram = histogram.iloc[-1]
    last_ema20 = ema20.iloc[-1]
    last_ema50 = ema50.iloc[-1]

    explanation = []

    if last_rsi < 30:
        explanation.append("RSI aşırı satım bölgesinde (<30)")
    if last_histogram > 0:
        explanation.append("MACD histogramı pozitif bölgeye geçti")
    if last_ema20 > last_ema50:
        explanation.append("Kısa vadeli trend (EMA20) uzun vadeli trendin (EMA50) üzerinde")

    if len(explanation) == 3:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar tam sağlanmadı"

def mean_reversion_short_signal(df):
    upper_band, lower_band = calculate_bollinger_bands(df, period=20)
    last_close = df['close'].iloc[-1]
    last_upper = upper_band.iloc[-1]

    explanation = []

    if last_close > last_upper:
        explanation.append("Fiyat üst Bollinger bandının üzerinde (aşırı fiyatlanma)")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def trend_following_long_signal(df):
    ema20 = calculate_ema(df, period=20)
    ema50 = calculate_ema(df, period=50)

    last_ema20 = ema20.iloc[-1]
    last_ema50 = ema50.iloc[-1]

    explanation = []

    if last_ema20 > last_ema50:
        explanation.append("EMA20, EMA50'nin üzerinde (yükseliş trendi teyidi)")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def volatility_breakout_signal(df):
    atr = calculate_atr(df, period=14)
    last_close = df['close'].iloc[-1]
    previous_close = df['close'].iloc[-2]
    last_atr = atr.iloc[-1]

    explanation = []

    if (last_close - previous_close) > last_atr:
        explanation.append("Fiyat ATR'nin üzerinde güçlü bir breakout gerçekleştirdi")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def stochastic_rsi_reversal_signal(df):
    stoch_rsi = calculate_stochastic_rsi(df, rsi_period=14, stoch_period=14)
    last_stoch_rsi = stoch_rsi.iloc[-1]
    previous_stoch_rsi = stoch_rsi.iloc[-2]

    explanation = []

    if previous_stoch_rsi < 0.2 and last_stoch_rsi > 0.2:
        explanation.append("Stochastic RSI düşük bölgeden yukarı kırılım gösterdi (reversal sinyali)")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar tam sağlanmadı"

def adx_trend_strength_signal(df):
    adx = calculate_adx(df, period=14)
    last_adx = adx.iloc[-1]

    explanation = []

    if last_adx > 25:
        explanation.append("ADX 25 seviyesinin üzerinde, güçlü trend var")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def cci_reversal_signal(df):
    cci = calculate_cci(df, period=20)
    last_cci = cci.iloc[-1]
    previous_cci = cci.iloc[-2]

    explanation = []

    if previous_cci < -100 and last_cci > -100:
        explanation.append("CCI -100 seviyesinden yukarı kırılım gösterdi (potansiyel dönüş sinyali)")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def vwap_trend_follow_signal(df):
    vwap = calculate_vwap(df)
    last_close = df['close'].iloc[-1]
    last_vwap = vwap.iloc[-1]

    explanation = []

    if last_close > last_vwap:
        explanation.append("Fiyat VWAP'ın üzerinde, trend güçlü ve devam ediyor")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def obv_breakout_signal(df):
    obv = calculate_obv(df)
    last_obv = obv.iloc[-1]
    previous_obv = obv.iloc[-2]

    explanation = []

    if last_obv > previous_obv:
        explanation.append("OBV yükseliyor, hacim destekli yükseliş sinyali")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"

def macd_zero_cross_signal(df):
    macd, signal_line, histogram = calculate_macd(df)
    last_macd = macd.iloc[-1]
    previous_macd = macd.iloc[-2]

    explanation = []

    if previous_macd < 0 and last_macd > 0:
        explanation.append("MACD sıfır çizgisinin üzerine çıktı (pozitif trend başlangıcı)")

    if explanation:
        return True, " ve ".join(explanation)
    else:
        return False, "Şartlar sağlanmadı"
