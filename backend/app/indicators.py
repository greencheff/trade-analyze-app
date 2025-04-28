import pandas as pd

def calculate_sma(df, period=20, column='close'):
    return df[column].rolling(window=period).mean()

def calculate_ema(df, period=20, column='close'):
    return df[column].ewm(span=period, adjust=False).mean()

def calculate_wma(df, period=20, column='close'):
    weights = pd.Series(range(1, period+1))
    return df[column].rolling(window=period).apply(lambda x: (x*weights).sum()/weights.sum(), raw=True)

def calculate_macd(df, fast=12, slow=26, signal=9, column='close'):
    ema_fast = df[column].ewm(span=fast, adjust=False).mean()
    ema_slow = df[column].ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram

def calculate_rsi(df, period=14, column='close'):
    delta = df[column].diff()
    gain  = delta.clip(lower=0)
    loss  = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / (avg_loss + 1e-8)
    return 100 - (100 / (1 + rs))

def calculate_stochastic_oscillator(df, k_period=14, d_period=3):
    low_min  = df['low'].rolling(window=k_period).min()
    high_max = df['high'].rolling(window=k_period).max()
    k = 100 * (df['close'] - low_min) / (high_max - low_min + 1e-8)
    d = k.rolling(window=d_period).mean()
    return k, d

def calculate_stochastic_rsi(df, rsi_period=14, stoch_period=14, column='close'):
    rsi = calculate_rsi(df, period=rsi_period, column=column)
    min_rsi = rsi.rolling(window=stoch_period).min()
    max_rsi = rsi.rolling(window=stoch_period).max()
    return 100 * (rsi - min_rsi) / (max_rsi - min_rsi + 1e-8)

def calculate_bollinger_bands(df, period=20, num_std=2, column='close'):
    sma = df[column].rolling(window=period).mean()
    std = df[column].rolling(window=period).std()
    upper = sma + std * num_std
    lower = sma - std * num_std
    return upper, lower

def calculate_atr(df, period=14):
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low']  - df['close'].shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr.rolling(window=period).mean()

def calculate_adx(df, period=14):
    plus_dm  = df['high'].diff()
    minus_dm = df['low'].diff()
    plus_dm  = plus_dm.where((plus_dm > minus_dm) & (plus_dm > 0), 0.0)
    minus_dm = minus_dm.where((minus_dm > plus_dm) & (minus_dm > 0), 0.0)
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low']  - df['close'].shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()
    plus_di  = 100 * (plus_dm.rolling(window=period).sum() / (atr + 1e-8))
    minus_di = 100 * (minus_dm.rolling(window=period).sum() / (atr + 1e-8))
    dx = (abs(plus_di - minus_di) / (plus_di + minus_di + 1e-8)) * 100
    return dx.rolling(window=period).mean()

def calculate_cci(df, period=20):
    tp = (df['high'] + df['low'] + df['close']) / 3
    sma = tp.rolling(window=period).mean()
    mad = tp.rolling(window=period).apply(lambda x: (x - x.mean()).abs().mean())
    return (tp - sma) / (0.015 * mad + 1e-8)

def calculate_vwap(df):
    pv = df['close'] * df['volume']
    return pv.cumsum() / df['volume'].cumsum()

def calculate_obv(df):
    direction = (df['close'].diff() > 0).astype(int) - (df['close'].diff() < 0).astype(int)
    return (df['volume'] * direction).cumsum()

def calculate_mfi(df, period=14):
    tp = (df['high'] + df['low'] + df['close']) / 3
    mf = tp * df['volume']
    pos = mf.where(tp > tp.shift(1), 0)
    neg = mf.where(tp < tp.shift(1), 0)
    ratio = pos.rolling(window=period).sum() / (neg.rolling(window=period).sum() + 1e-8)
    return 100 - (100 / (1 + ratio))

def calculate_williams_r(df, period=14):
    highest = df['high'].rolling(window=period).max()
    lowest  = df['low'].rolling(window=period).min()
    return -100 * (highest - df['close']) / (highest - lowest + 1e-8)

def calculate_roc(df, period=12, column='close'):
    return (df[column].diff(period) / (df[column].shift(period) + 1e-8)) * 100

def calculate_dmi(df, period=14):
    plus_dm  = df['high'].diff()
    minus_dm = df['low'].diff()
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low']  - df['close'].shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1).rolling(window=period).sum()
    plus_di  = 100 * (plus_dm.where((plus_dm>minus_dm)&(plus_dm>0),0).rolling(window=period).sum() / (tr + 1e-8))
    minus_di = 100 * (minus_dm.where((minus_dm>plus_dm)&(minus_dm>0),0).rolling(window=period).sum() / (tr + 1e-8))
    return plus_di, minus_di

def calculate_ultimate_oscillator(df, short=7, medium=14, long=28):
    pc = df['close'].shift(1)
    bp = df['close'] - pd.concat([df['low'], pc], axis=1).min(axis=1)
    tr = pd.concat([
        df['high'] - df['low'],
        (df['high'] - pc).abs(),
        (df['low'] - pc).abs()
    ], axis=1).max(axis=1)
    avg1 = bp.rolling(window=short).sum()  / tr.rolling(window=short).sum()
    avg2 = bp.rolling(window=medium).sum() / tr.rolling(window=medium).sum()
    avg3 = bp.rolling(window=long).sum()   / tr.rolling(window=long).sum()
    return 100 * ((4*avg1) + (2*avg2) + avg3) / (4+2+1)

def calculate_tsi(df, long=25, signal=13, column='close'):
    m = df[column].diff()
    ema1 = m.ewm(span=long, adjust=False).mean()
    ema2 = ema1.ewm(span=long, adjust=False).mean()
    abs_m = m.abs()
    abs1 = abs_m.ewm(span=long, adjust=False).mean()
    abs2 = abs1.ewm(span=long, adjust=False).mean()
    tsi_line = 100 * (ema2 / (abs2 + 1e-8))
    signal_line = tsi_line.ewm(span=signal, adjust=False).mean()
    return tsi_line, signal_line

def calculate_ppo(df, fast=12, slow=26, signal=9, column='close'):
    ema_fast = df[column].ewm(span=fast, adjust=False).mean()
    ema_slow = df[column].ewm(span=slow, adjust=False).mean()
    ppo_line = (ema_fast - ema_slow) / (ema_slow + 1e-8) * 100
    signal_line = ppo_line.ewm(span=signal, adjust=False).mean()
    hist = ppo_line - signal_line
    return ppo_line, signal_line, hist

def calculate_keltner_channel(df, period=20, multiplier=2):
    ema = df['close'].ewm(span=period, adjust=False).mean()
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low']  - df['close'].shift()).abs()
    atr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1).rolling(window=period).mean()
    upper = ema + multiplier * atr
    lower = ema - multiplier * atr
    return upper, lower

def calculate_donchian_channel(df, period=20):
    upper = df['high'].rolling(window=period).max()
    lower = df['low'].rolling(window=period).min()
    return upper, lower

def calculate_ichimoku_conversion_line(df, period=9):
    return (df['high'].rolling(window=period).max() + df['low'].rolling(window=period).min()) / 2

def calculate_ichimoku_base_line(df, period=26):
    return (df['high'].rolling(window=period).max() + df['low'].rolling(window=period).min()) / 2

def calculate_ichimoku_leading_span_a(df):
    conv = calculate_ichimoku_conversion_line(df)
    base = calculate_ichimoku_base_line(df)
    return ((conv + base) / 2).shift(26)


import pandas as pd

def calculate_elder_ray(df, period=14):
    """Elder Ray Index – Bull ve Bear gücü."""
    ema = df['close'].ewm(span=period, adjust=False).mean()
    bull = df['high'] - ema
    bear = ema - df['low']
    return bull, bear

def calculate_aroon_up(df, period=25):
    """Aroon Up."""
    return df['high'].rolling(window=period+1).apply(
        lambda x: ((period - x[::-1].argmax()) / period) * 100, raw=True)

def calculate_aroon_down(df, period=25):
    """Aroon Down."""
    return df['low'].rolling(window=period+1).apply(
        lambda x: ((period - x[::-1].argmin()) / period) * 100, raw=True)

def calculate_vortex_indicator(df, period=14):
    """Vortex Indicator – VI+ ve VI-."""
    tr = pd.concat([
        df['high'] - df['low'],
        (df['high'] - df['close'].shift()).abs(),
        (df['low'] - df['close'].shift()).abs()
    ], axis=1).max(axis=1)
    tr_sum = tr.rolling(window=period).sum()
    vmp = (df['high'] - df['low'].shift()).abs().rolling(window=period).sum()
    vmm = (df['low'] - df['high'].shift()).abs().rolling(window=period).sum()
    vip = vmp / (tr_sum + 1e-8)
    vin = vmm / (tr_sum + 1e-8)
    return vip, vin

def calculate_coppock_curve(df, period1=14, period2=11, period3=10):
    """Coppock Curve."""
    roc1 = df['close'].pct_change(periods=period1)
    roc2 = df['close'].pct_change(periods=period2)
    wma = (roc1 + roc2)
    return wma.rolling(window=period3).mean()

def calculate_gann_fan(df, period=14):
    """
    Basit Gann Fan (4 çizgi): period boyunca ortalama üzerine Fark çarpanı.
    Gerçek çizim için grafik kütüphanesi gerekir.
    """
    ma = df['close'].rolling(window=period).mean()
    diff = df['close'] - ma
    fan1 = ma + 1 * diff
    fan2 = ma + 2 * diff
    fan3 = ma + 3 * diff
    fan4 = ma + 4 * diff
    return fan1, fan2, fan3, fan4

def calculate_pivot_points(df):
    """Klasik Pivot Noktaları: Pivot, S1, R1, S2, R2."""
    high = df['high']
    low = df['low']
    close = df['close']
    pivot = (high + low + close) / 3
    s1 = 2 * pivot - high
    r1 = 2 * pivot - low
    s2 = pivot - (high - low)
    r2 = pivot + (high - low)
    return pivot, s1, r1, s2, r2

def calculate_fibonacci_retracement(df, period=20):
    """Fibonacci Düzeltme Seviyeleri (0.236, 0.382, 0.5, 0.618)."""
    high = df['high'].rolling(window=period).max()
    low  = df['low'].rolling(window=period).min()
    diff = high - low
    l236 = low + 0.236 * diff
    l382 = low + 0.382 * diff
    l500 = low + 0.5   * diff
    l618 = low + 0.618 * diff
    return l236, l382, l500, l618

def calculate_fibonacci_extension(df, period=20):
    """Fibonacci Uzatma Seviyeleri (1.272, 1.414, 1.618)."""
    high = df['high'].rolling(window=period).max()
    low  = df['low'].rolling(window=period).min()
    diff = high - low
    e127 = high + 1.272 * diff
    e141 = high + 1.414 * diff
    e161 = high + 1.618 * diff
    return e127, e141, e161

def calculate_price_channel_upper(df, period=20):
    """Price Channel Üst Bant."""
    return df['high'].rolling(window=period).max()

def calculate_price_channel_lower(df, period=20):
    """Price Channel Alt Bant."""
    return df['low'].rolling(window=period).min()

def calculate_envelope_bands(df, period=20, deviation=0.02):
    """Envelopes."""
    sma = df['close'].rolling(window=period).mean()
    upper = sma * (1 + deviation)
    lower = sma * (1 - deviation)
    return upper, lower

def calculate_zscore(df, period=20, column='close'):
    """Z-Score."""
    ma = df[column].rolling(window=period).mean()
    sd = df[column].rolling(window=period).std()
    return (df[column] - ma) / (sd + 1e-8)

def calculate_cmo(df, period=14, column='close'):
    """Chande Momentum Oscillator."""
    diff = df[column].diff()
    gain = diff.clip(lower=0)
    loss = -diff.clip(upper=0)
    sum_gain = gain.rolling(window=period).sum()
    sum_loss = loss.rolling(window=period).sum()
    return 100 * (sum_gain - sum_loss) / (sum_gain + sum_loss + 1e-8)

def calculate_balance_of_power(df):
    """Balance of Power."""
    return (df['close'] - df['open']) / (df['high'] - df['low'] + 1e-8)

def calculate_force_index(df, period=13):
    """Force Index."""
    return df['close'].diff(period) * df['volume']

def calculate_ease_of_movement(df, period=14):
    """Ease of Movement."""
    distance = ((df['high'] + df['low'])/2) - ((df['high'].shift() + df['low'].shift())/2)
    box = df['volume'] / (df['high'] - df['low'] + 1e-8)
    emv = distance / (box + 1e-8)
    return emv.rolling(window=period).mean()

def calculate_accumulation_distribution(df):
    """Accumulation/Distribution Line."""
    clv = ((df['close'] - df['low']) - (df['high'] - df['close'])) / (df['high'] - df['low'] + 1e-8)
    return (clv * df['volume']).cumsum()

def calculate_chaikin_money_flow(df, period=20):
    """Chaikin Money Flow."""
    clv = ((df['close'] - df['low']) - (df['high'] - df['close'])) / (df['high'] - df['low'] + 1e-8)
    mfv = clv * df['volume']
    return mfv.rolling(window=period).sum() / df['volume'].rolling(window=period).sum()

def calculate_chaikin_oscillator(df, short=3, long=10):
    """Chaikin Oscillator."""
    clv = ((df['close'] - df['low']) - (df['high'] - df['close'])) / (df['high'] - df['low'] + 1e-8)
    mfv = clv * df['volume']
    ema_short = mfv.ewm(span=short, adjust=False).mean()
    ema_long  = mfv.ewm(span=long,  adjust=False).mean()
    return ema_short - ema_long

def calculate_rvi(df, period=10):
    """Relative Vigor Index."""
    num = (df['close'] - df['open']).rolling(window=period).mean()
    den = (df['high'] - df['low']).rolling(window=period).mean()
    return num / (den + 1e-8)

def calculate_dpo(df, period=20, column='close'):
    """Detrended Price Oscillator."""
    shift = int(period/2 + 1)
    ma = df[column].rolling(window=period).mean()
    return df[column].shift(shift) - ma

def calculate_csi(df, period=14, column='close'):
    """Commodity Selection Index."""
    tp = (df['high'] + df['low'] + df['close']) / 3
    ma = tp.rolling(window=period).mean()
    std = tp.rolling(window=period).std()
    return ((tp - ma) / (std + 1e-8)) * (df['volume'] / df['volume'].rolling(window=period).mean())

def calculate_mcclellan_oscillator(df, advances, declines, short=19, long=39):
    """McClellan Oscillator – requires 'advances' & 'declines' columns or series."""
    diff = advances - declines
    ema_short = diff.ewm(span=short, adjust=False).mean()
    ema_long  = diff.ewm(span=long,  adjust=False).mean()
    return ema_short - ema_long

def calculate_mcclellan_summation(df, advances, declines, short=19, long=39):
    """McClellan Summation Index."""
    osc = calculate_mcclellan_oscillator(df, advances, declines, short, long)
    return osc.cumsum()

def calculate_high_low_index(df, period=14):
    """High-Low Index (new highs/new lows)."""
    highs = df['high'] > df['high'].shift(1)
    lows  = df['low']  < df['low'].shift(1)
    new_highs = highs.rolling(window=period).sum()
    new_lows  = lows.rolling(window=period).sum()
    return new_highs / (new_highs + new_lows + 1e-8)


import pandas as pd
import numpy as np

def calculate_fractal_indicator(df, window=5):
    """
    Fractal Indicator:
    Fraktal yüksek/düşük noktalarını tespit eder (center of window en yüksek/en düşük).
    Returns two Series: fractal_highs, fractal_lows (1.0 or 0.0).
    """
    half = window // 2

    def is_fractal_high(x):
        center = x.iloc[half]
        return float(center == x.max())

    def is_fractal_low(x):
        center = x.iloc[half]
        return float(center == x.min())

    highs = df['high'].rolling(window=window, center=True).apply(is_fractal_high, raw=False)
    lows  = df['low'].rolling(window=window, center=True).apply(is_fractal_low,  raw=False)
    return highs, lows

def calculate_zig_zag_indicator(df, pct=5, column='close'):
    """
    ZigZag Indicator:
    Fiyat, pct (%) değiştiğinde pivot noktası işaretler.
    Returns a Series with pivot prices or NaN.
    """
    pivots = pd.Series(np.nan, index=df.index)
    last_pivot = df[column].iloc[0]
    trend = None
    for i in range(1, len(df)):
        price = df[column].iat[i]
        up_thresh = last_pivot * (1 + pct/100)
        dn_thresh = last_pivot * (1 - pct/100)
        if trend is None:
            if price > up_thresh:
                trend = 'up'; last_pivot = price; pivots.iat[i] = price
            elif price < dn_thresh:
                trend = 'down'; last_pivot = price; pivots.iat[i] = price
        elif trend == 'up':
            if price > last_pivot:
                last_pivot = price; pivots.iat[i] = price
            elif price < dn_thresh:
                trend = 'down'; last_pivot = price; pivots.iat[i] = price
        else:  # down
            if price < last_pivot:
                last_pivot = price; pivots.iat[i] = price
            elif price > up_thresh:
                trend = 'up'; last_pivot = price; pivots.iat[i] = price
    return pivots

def calculate_gopalakrishnan_range_index(df, period=10):
    """
    GAPO – Gopalakrishnan Range Index
    Piyasa karmaşıklığını ölçer.
    """
    tr = df['high'] - df['low']
    log_tr = np.log(tr + 1e-8)
    sum_log = log_tr.rolling(window=period).sum()
    price_range = df['high'].rolling(window=period).max() - df['low'].rolling(window=period).min()
    log_range = np.log(price_range + 1e-8)
    return sum_log / log_range

def calculate_qstick_indicator(df, period=10):
    """
    QStick Indicator
    Kapanış- Açılış farkının ortalaması.
    """
    return (df['close'] - df['open']).rolling(window=period).mean()

def calculate_fractal_chaos_oscillator(df, period=10):
    """
    Fractal Chaos Oscillator
    Yüksek-düşük toplamlari ile kapanış farkları oranı.
    """
    hl_sum = (df['high'] - df['low']).rolling(window=period).sum()
    cl_sum = df['close'].diff().abs().rolling(window=period).sum()
    return hl_sum / (cl_sum + 1e-8)

def calculate_supertrend(df, period=10, multiplier=3):
    """
    SuperTrend Indicator
    ATR bazlı trend takip göstergesi.
    """
    hl2 = (df['high'] + df['low']) / 2
    tr = pd.concat([
        df['high'] - df['low'],
        (df['high'] - df['close'].shift()).abs(),
        (df['low']  - df['close'].shift()).abs()
    ], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()
    upper = hl2 + multiplier * atr
    lower = hl2 - multiplier * atr
    supertrend = pd.Series(index=df.index)
    direction = pd.Series(1, index=df.index)
    for i in range(1, len(df)):
        if df['close'].iat[i] > upper.iat[i-1]:
            direction.iat[i] = 1
        elif df['close'].iat[i] < lower.iat[i-1]:
            direction.iat[i] = -1
        else:
            direction.iat[i] = direction.iat[i-1]
            if direction.iat[i] == 1:
                lower.iat[i] = max(lower.iat[i], lower.iat[i-1])
            else:
                upper.iat[i] = min(upper.iat[i], upper.iat[i-1])
        supertrend.iat[i] = lower.iat[i] if direction.iat[i] == 1 else upper.iat[i]
    return supertrend

def calculate_rainbow_moving_average(df, periods=[5,10,20,30,40,50], column='close'):
    """
    Rainbow Moving Average
    Farkli periyotlarda birkaç EMA.
    Returns a DataFrame.
    """
    out = pd.DataFrame(index=df.index)
    for p in periods:
        out[f'EMA_{p}'] = df[column].ewm(span=p, adjust=False).mean()
    return out

def _hilbert_transform(x):
    """
    Analytic signal via FFT Hilbert transform.
    """
    N = len(x)
    Xf = np.fft.fft(x)
    H = np.zeros(N)
    if N % 2 == 0:
        H[0] = H[N//2] = 1
        H[1:N//2] = 2
    else:
        H[0] = 1
        H[1:(N+1)//2] = 2
    return np.fft.ifft(Xf * H)

def calculate_hilbert_instantaneous_trendline(df, column='close'):
    """
    Hilbert Transform – Instantaneous Trendline
    """
    x = df[column].to_numpy()
    ana = _hilbert_transform(x)
    return pd.Series(np.real(ana), index=df.index)

def calculate_hilbert_dominant_cycle_period(df, column='close'):
    """
    Hilbert Transform – Dominant Cycle Period
    """
    x = df[column].to_numpy()
    ana = _hilbert_transform(x)
    phase = np.unwrap(np.angle(ana))
    inst_freq = np.diff(phase) / (2 * np.pi)
    period = 1 / (inst_freq + 1e-8)
    return pd.Series(np.concatenate(([np.nan], period)), index=df.index)

def calculate_hilbert_dominant_cycle_phase(df, column='close'):
    """
    Hilbert Transform – Dominant Cycle Phase
    """
    x = df[column].to_numpy()
    ana = _hilbert_transform(x)
    phase = np.angle(ana)
    return pd.Series(phase, index=df.index)

def calculate_sine_wave_indicator(df, column='close'):
    """
    Sine Wave Indicator
    """
    x = df[column].to_numpy()
    ana = _hilbert_transform(x)
    phase = np.angle(ana)
    sine = np.sin(phase)
    return pd.Series(sine, index=df.index)

def calculate_trend_intensity_index(df, period=14, column='close'):
    """
    Trend Intensity Index (TII)
    """
    hi_lo = (df['high'] - df['low']).rolling(window=period).mean()
    cls_diff = df[column].diff().abs().rolling(window=period).mean()
    return 100 * (cls_diff / (hi_lo + 1e-8))

def calculate_schaff_trend_cycle(df, fast=23, slow=50, cycle=10, column='close'):
    """
    Schaff Trend Cycle (STC)
    """
    macd_line, _, _ = calculate_macd(df, fast=fast, slow=slow, signal=cycle, column=column)
    k, _ = calculate_stochastic_oscillator(
        pd.DataFrame({'close': macd_line}), k_period=cycle, d_period=cycle
    )
    return k

def calculate_fisher_transform(df, period=10, column='close'):
    """
    Fisher Transform Indicator
    """
    high = df[column].rolling(window=period).max()
    low  = df[column].rolling(window=period).min()
    val  = 2 * (df[column] - low) / (high - low + 1e-8) - 1
    val  = val.clip(-0.999, 0.999)
    fisher = 0.5 * np.log((1 + val) / (1 - val))
    return pd.Series(fisher, index=df.index)

def calculate_volume_oscillator(df, short_period=14, long_period=28):
    """
    Volume Oscillator
    """
    vs = df['volume'].rolling(window=short_period).mean()
    vl = df['volume'].rolling(window=long_period).mean()
    return 100 * (vs - vl) / (vl + 1e-8)

def calculate_choppiness_index(df, period=14):
    """
    Choppiness Index
    """
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low']  - df['close'].shift()).abs()
    tr  = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    sum_tr = tr.rolling(window=period).sum()
    maxh   = df['high'].rolling(window=period).max()
    minh   = df['low'].rolling(window=period).min()
    return 100 * (np.log10(sum_tr / (maxh - minh + 1e-8)) / np.log10(period))

def calculate_rmi(df, period=14, momentum=1, column='close'):
    """
    Relative Momentum Index (RMI)
    """
    m     = df[column].diff(momentum)
    gain  = m.clip(lower=0)
    loss  = -m.clip(upper=0)
    avg_g = gain.rolling(window=period).mean()
    avg_l = loss.rolling(window=period).mean()
    return 100 - (100 / (1 + avg_g / (avg_l + 1e-8)))

def calculate_mass_index(df, ema_period=9, sum_period=25):
    """
    Mass Index
    """
    hl  = df['high'] - df['low']
    e1  = hl.ewm(span=ema_period, adjust=False).mean()
    e2  = e1.ewm(span=ema_period, adjust=False).mean()
    mi  = (e1 / (e2 + 1e-8)).rolling(window=sum_period).sum()
    return mi

def calculate_intraday_momentum_index(df, period=14):
    """
    Intraday Momentum Index (IMI)
    """
    up   = (df['close'] - df['open']).clip(lower=0)
    down = (df['open']  - df['close']).clip(lower=0)
    return 100 * up.rolling(window=period).sum() / (
        up.rolling(window=period).sum() + down.rolling(window=period).sum() + 1e-8
    )

def calculate_stochastic_momentum_index(df, period=14, smooth=3):
    """
    Stochastic Momentum Index (SMI)
    """
    high_max = df['high'].rolling(window=period).max()
    low_min  = df['low'] .rolling(window=period).min()
    mid      = (high_max + low_min) / 2
    diff     = df['close'] - mid
    md       = (high_max - low_min) / 2
    ema1     = diff.ewm(span=smooth, adjust=False).mean()
    ema2     = ema1.ewm(span=smooth, adjust=False).mean()
    ema3     = md.ewm(span=smooth, adjust=False).mean()
    ema4     = ema3.ewm(span=smooth, adjust=False).mean()
    return 100 * (ema2 / (ema4 + 1e-8))

def calculate_elder_impulse_system(df, ema_period=13, rsi_period=13, column='close'):
    """
    Elder Impulse System
    """
    trend    = df[column].ewm(span=ema_period, adjust=False).mean()
    momentum = calculate_rsi(df, period=rsi_period, column=column)
    signal   = pd.Series(0, index=df.index)
    for i in range(1, len(df)):
        if trend.iat[i] > trend.iat[i-1] and momentum.iat[i] > momentum.iat[i-1]:
            signal.iat[i] =  1
        elif trend.iat[i] < trend.iat[i-1] and momentum.iat[i] < momentum.iat[i-1]:
            signal.iat[i] = -1
        else:
            signal.iat[i] =  0
    return signal

def calculate_connors_rsi(df, rsi_period=3, streak_period=100, column='close'):
    """
    Connors RSI
    """
    # 1) Kısa RSI
    rsi_short = calculate_rsi(df, period=rsi_period, column=column)
    # 2) Streak
    diff   = df[column].diff()
    streak = diff.copy().fillna(0)
    for i in range(1, len(streak)):
        streak.iat[i] = streak.iat[i-1] + np.sign(diff.iat[i])
    pr = streak.rolling(window=streak_period).apply(lambda x: x.rank(pct=True).iloc[-1]) * 100
    # 3) ROC-tabanlı RSI
    roc      = df[column].pct_change(periods=rsi_period) * 100
    rsi_roc  = calculate_rsi(pd.DataFrame({column: roc}), period=rsi_period, column=column)
    return (rsi_short + pr + rsi_roc) / 3

def calculate_advance_decline_line(df, adv_col='advances', dec_col='declines'):
    """
    Advance/Decline Line
    """
    return (df[adv_col] - df[dec_col]).cumsum()

def calculate_advance_decline_ratio(df, adv_col='advances', dec_col='declines'):
    """
    Advance/Decline Ratio
    """
    return df[adv_col] / (df[dec_col] + 1e-8)

def calculate_advance_decline_volume_line(df, adv_vol_col='adv_volume', dec_vol_col='dec_volume'):
    """
    Advance-Decline Volume Line
    """
    return (df[adv_vol_col] - df[dec_vol_col]).cumsum()


import pandas as pd
import numpy as np

# --- 76–100: Ek Teknik Analiz İndikatörleri ---

def calculate_put_call_ratio(df, put_col='put_volume', call_col='call_volume'):
    return df[put_col] / (df[call_col] + 1e-8)

def calculate_short_interest_ratio(df, short_col='short_interest', vol_col='volume'):
    return df[short_col] / (df[vol_col] + 1e-8)

def calculate_beta(df, market_df, period=252, column='close', market_column='close'):
    ret = df[column].pct_change()
    mret = market_df[market_column].pct_change()
    cov = ret.rolling(window=period).cov(mret)
    var = mret.rolling(window=period).var()
    return cov / (var + 1e-8)

def calculate_alpha(df, market_df, rf=0.0, period=252, column='close', market_column='close'):
    ret = df[column].pct_change()
    mret = market_df[market_column].pct_change()
    beta = calculate_beta(df, market_df, period, column, market_column)
    excess = ret - rf
    return excess.rolling(window=period).mean() - beta * mret.rolling(window=period).mean()

def calculate_treynor_ratio(df, market_df, rf=0.0, period=252, column='close', market_column='close'):
    ret = df[column].pct_change()
    beta = calculate_beta(df, market_df, period, column, market_column)
    return (ret.rolling(window=period).mean() - rf) / (beta + 1e-8)

def calculate_sharpe_ratio(df, rf=0.0, period=252, column='close'):
    ret = df[column].pct_change()
    mu  = ret.rolling(window=period).mean() - rf
    sd  = ret.rolling(window=period).std()
    return mu / (sd + 1e-8)

def calculate_sortino_ratio(df, rf=0.0, period=252, column='close'):
    ret = df[column].pct_change()
    down = ret.copy()
    down[down > 0] = 0
    dd = down.rolling(window=period).std()
    mu = ret.rolling(window=period).mean() - rf
    return mu / (dd + 1e-8)

def calculate_calmar_ratio(df, period=252, column='close'):
    ret = df[column].pct_change()
    # CAGR
    start, end = df[column].iloc[0], df[column].iloc[-1]
    cagr = (end / start) ** (252/len(df)) - 1
    # Max Drawdown
    drawdown = calculate_drawdown(df, column)
    max_dd = drawdown.min()
    return cagr / (abs(max_dd) + 1e-8)

def calculate_sterling_ratio(df, rf=0.0, factor=1, period=252, column='close'):
    # CAGR
    start, end = df[column].iloc[0], df[column].iloc[-1]
    cagr = (end / start) ** (252/len(df)) - 1
    # Avg Drawdown
    drawdown = calculate_drawdown(df, column)
    avg_dd = drawdown[drawdown < 0].mean() * factor
    return (cagr - rf) / (abs(avg_dd) + 1e-8)

def calculate_ulcer_index(df, period=14, column='close'):
    rolling_max = df[column].rolling(window=period, min_periods=1).max()
    drawdown   = (df[column] - rolling_max) / (rolling_max + 1e-8) * 100
    sq         = drawdown ** 2
    return np.sqrt(sq.rolling(window=period).mean())

def calculate_drawdown(df, column='close'):
    cum_max = df[column].cummax()
    return (df[column] - cum_max) / (cum_max + 1e-8)

def calculate_kelly_criterion(df, column='close'):
    ret = df[column].pct_change().dropna()
    w   = (ret > 0).sum() / len(ret)
    win = ret[ret > 0].mean()
    loss= -ret[ret < 0].mean()
    return (w / (1 - w + 1e-8)) * (win / (loss + 1e-8))

def calculate_chandelier_exit(df, period=22, multiplier=3):
    hl2 = (df['high'] + df['low'] + df['close']) / 3
    tr  = pd.concat([
        df['high'] - df['low'],
        (df['high'] - df['close'].shift()).abs(),
        (df['low']  - df['close'].shift()).abs()
    ], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()
    long_exit  = hl2 - multiplier * atr
    short_exit = hl2 + multiplier * atr
    return long_exit, short_exit

def calculate_adxr(df, period=14):
    from app.indicators import calculate_adx
    adx = calculate_adx(df, period)
    return (adx + adx.shift(period)) / 2

def calculate_hurst_exponent(df, column='close', max_lag=20):
    lags = range(2, max_lag)
    tau  = [np.sqrt(((df[column].diff(lag)).dropna()**2).mean()) for lag in lags]
    poly = np.polyfit(np.log(lags), np.log(tau), 1)
    hurst = poly[0] * 2
    return pd.Series(hurst, index=df.index)

def calculate_moving_average_ribbon(df, periods=[10,20,30,40,50], column='close'):
    ribbon = pd.DataFrame(index=df.index)
    for p in periods:
        ribbon[f'SMA_{p}'] = df[column].rolling(window=p).mean()
    return ribbon

def calculate_pfe(df, period=14, column='close'):
    diff       = df[column].diff(period)
    abs_sum    = df[column].diff().abs().rolling(window=period).sum()
    return 100 * (diff / (abs_sum + 1e-8))

def calculate_fractal_adaptive_moving_average(df, period=10, column='close'):
    high_low = df['high'].rolling(window=period).max() - df['low'].rolling(window=period).min()
    fd       = np.log(high_low/period + 1e-8) / np.log(period)
    alpha    = np.exp(-4.6 * (fd - 1))
    return df[column].ewm(alpha=alpha, adjust=False).mean()

def calculate_jurik_moving_average(df, period=20, phase=0.7, column='close'):
    ema1 = df[column].ewm(span=period, adjust=False).mean()
    return ema1.ewm(alpha=phase, adjust=False).mean()

def calculate_tema(df, period=20, column='close'):
    ema1 = df[column].ewm(span=period, adjust=False).mean()
    ema2 = ema1.ewm(span=period, adjust=False).mean()
    ema3 = ema2.ewm(span=period, adjust=False).mean()
    return 3*(ema1 - ema2) + ema3

def calculate_dema(df, period=20, column='close'):
    ema = df[column].ewm(span=period, adjust=False).mean()
    return 2*ema - ema.ewm(span=period, adjust=False).mean()

def calculate_frama(df, period=10, column='close'):
    hl_range = df['high'].rolling(window=period).max() - df['low'].rolling(window=period).min()
    fd       = np.log(hl_range/period + 1e-8) / np.log(period)
    alpha    = np.exp(-4.6 * (fd - 1))
    return df[column].ewm(alpha=alpha, adjust=False).mean()

def calculate_center_of_gravity(df, period=10, column='close'):
    w   = pd.Series(range(1, period+1))
    cog = df[column].rolling(window=period).apply(
        lambda x: (w*x).sum()/ (w.sum() + 1e-8), raw=True)
    return cog.shift(-(period//2))

def calculate_relative_strength_levy(df, benchmark_df, period=14, column='close', bench_column='close'):
    r1 = df[column].pct_change(periods=period)
    r2 = benchmark_df[bench_column].pct_change(periods=period)
    return r1 / (r2 + 1e-8)

def calculate_seasonal_tendency(df, column='close'):
    # Aylık ortalama getiriler
    df2 = df.copy()
    df2['month'] = df2.index.to_series().dt.month
    monthly = df2[column].pct_change().groupby(df2['month']).transform('mean')
    return monthly


