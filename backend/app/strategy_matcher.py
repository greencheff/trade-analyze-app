# strategy_matcher.py

def momentum_long_signal(df):
    try:
        if 'rsi' in df.columns and df['rsi'].iloc[-1] < 30:
            return True, "RSI aşırı satım bölgesinde. Alım fırsatı olabilir."
    except:
        pass
    return False, "RSI aşırı satım bölgesinde değil."

def mean_reversion_short_signal(df):
    try:
        if 'rsi' in df.columns and df['rsi'].iloc[-1] > 70:
            return True, "RSI aşırı alım bölgesinde. Satış fırsatı olabilir."
    except:
        pass
    return False, "RSI aşırı alım bölgesinde değil."

def trend_following_long_signal(df):
    try:
        if 'calculate_ema' in df.columns and df['close'].iloc[-1] > df['calculate_ema'].iloc[-1]:
            return True, "Fiyat EMA üzerinde. Yükselen trend mümkün."
    except:
        pass
    return False, "Fiyat EMA üzerinde değil."

def volatility_breakout_signal(df):
    try:
        if 'calculate_bollinger_bands_0' in df.columns and df['close'].iloc[-1] > df['calculate_bollinger_bands_0'].iloc[-1]:
            return True, "Fiyat üst Bollinger bandını kırdı. Güçlü yükseliş işareti olabilir."
    except:
        pass
    return False, "Fiyat üst Bollinger bandını aşmadı."

def stochastic_rsi_reversal_signal(df):
    try:
        if 'stoch_rsi' in df.columns and df['stoch_rsi'].iloc[-1] < 0.2:
            return True, "Stochastic RSI aşırı satımda. Dönüş gelebilir."
    except:
        pass
    return False, "Stochastic RSI aşırı satımda değil."

def adx_trend_strength_signal(df):
    try:
        if 'adx' in df.columns and df['adx'].iloc[-1] > 25:
            return True, "ADX yüksek. Güçlü bir trend var."
    except:
        pass
    return False, "ADX düşük. Belirsiz trend."

def cci_reversal_signal(df):
    try:
        if 'cci' in df.columns and df['cci'].iloc[-1] < -100:
            return True, "CCI aşırı satım bölgesinde. Yükseliş beklenebilir."
    except:
        pass
    return False, "CCI aşırı satımda değil."

def vwap_trend_follow_signal(df):
    try:
        if 'vwap' in df.columns and df['close'].iloc[-1] > df['vwap'].iloc[-1]:
            return True, "Fiyat VWAP üzerinde. Yükseliş eğilimi olabilir."
    except:
        pass
    return False, "Fiyat VWAP üzerinde değil."

def obv_breakout_signal(df):
    try:
        if 'obv' in df.columns and df['obv'].iloc[-1] > df['obv'].rolling(window=20).mean().iloc[-1]:
            return True, "OBV yükseliş sinyali veriyor."
    except:
        pass
    return False, "OBV yükseliş sinyali vermiyor."

def macd_zero_cross_signal(df):
    try:
        if 'calculate_macd_0' in df.columns and df['calculate_macd_0'].iloc[-1] > 0:
            return True, "MACD sıfırın üzerinde. Alım baskısı var."
    except:
        pass
    return False, "MACD sıfırın üzerinde değil."

def run_all_strategies(df):
    results = {}

    momentum_signal, momentum_explanation = momentum_long_signal(df)
    mean_reversion_signal, mean_reversion_explanation = mean_reversion_short_signal(df)
    trend_following_signal, trend_following_explanation = trend_following_long_signal(df)
    volatility_breakout_signal, volatility_breakout_explanation = volatility_breakout_signal(df)
    stochastic_rsi_signal, stochastic_rsi_explanation = stochastic_rsi_reversal_signal(df)
    adx_signal, adx_explanation = adx_trend_strength_signal(df)
    cci_signal, cci_explanation = cci_reversal_signal(df)
    vwap_signal, vwap_explanation = vwap_trend_follow_signal(df)
    obv_signal, obv_explanation = obv_breakout_signal(df)
    macd_cross_signal, macd_cross_explanation = macd_zero_cross_signal(df)

    results["Momentum"] = momentum_explanation
    results["Mean Reversion"] = mean_reversion_explanation
    results["Trend Following"] = trend_following_explanation
    results["Volatility Breakout"] = volatility_breakout_explanation
    results["Stochastic RSI Reversal"] = stochastic_rsi_explanation
    results["ADX Güçlü Trend"] = adx_explanation
    results["CCI Reversal"] = cci_explanation
    results["VWAP Trend"] = vwap_explanation
    results["OBV Breakout"] = obv_explanation
    results["MACD Zero Cross"] = macd_cross_explanation

    return results
