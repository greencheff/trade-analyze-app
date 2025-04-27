import pandas as pd

def df_from_candles(candles):
    df = pd.DataFrame(candles)
    return df

def calculate_rsi(df, period: int = 14):
    delta = df['close'].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()
    rs = avg_gain / (avg_loss + 1e-8)
    return 100 - (100 / (1 + rs))

def calculate_macd(df, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = df['close'].ewm(span=fast, adjust=False).mean()
    ema_slow = df['close'].ewm(span=slow, adjust=False).mean()
    macd = ema_fast - ema_slow
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    histogram = macd - signal_line
    return macd, signal_line, histogram

def calculate_ema(df, period: int = 20, column: str = 'close'):
    return df[column].ewm(span=period, adjust=False).mean()

def calculate_sma(df, period: int = 20, column: str = 'close'):
    return df[column].rolling(window=period).mean()

def calculate_bollinger_bands(df, period: int = 20, num_std_dev: float = 2.0):
    sma = calculate_sma(df, period)
    std = df['close'].rolling(window=period).std()
    upper_band = sma + (std * num_std_dev)
    lower_band = sma - (std * num_std_dev)
    return upper_band, lower_band

def calculate_atr(df, period: int = 14):
    high_low = df['high'] - df['low']
    high_close = (df['high'] - df['close'].shift()).abs()
    low_close = (df['low'] - df['close'].shift()).abs()
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = ranges.max(axis=1)
    atr = true_range.rolling(window=period).mean()
    return atr

def calculate_stochastic_rsi(df, rsi_period: int = 14, stoch_period: int = 14):
    rsi = calculate_rsi(df, period=rsi_period)
    lowest_rsi = rsi.rolling(window=stoch_period).min()
    highest_rsi = rsi.rolling(window=stoch_period).max()
    stoch_rsi = (rsi - lowest_rsi) / (highest_rsi - lowest_rsi + 1e-8)
    return stoch_rsi

def calculate_adx(df, period: int = 14):
    plus_dm = df['high'].diff()
    minus_dm = df['low'].diff()
    plus_dm = plus_dm.where((plus_dm > minus_dm) & (plus_dm > 0), 0.0)
    minus_dm = minus_dm.where((minus_dm > plus_dm) & (minus_dm > 0), 0.0)
    tr1 = df['high'] - df['low']
    tr2 = (df['high'] - df['close'].shift()).abs()
    tr3 = (df['low'] - df['close'].shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=period).mean()
    plus_di = 100 * (plus_dm.rolling(window=period).sum() / atr)
    minus_di = 100 * (minus_dm.rolling(window=period).sum() / atr)
    dx = (abs(plus_di - minus_di) / (plus_di + minus_di + 1e-8)) * 100
    adx = dx.rolling(window=period).mean()
    return adx

def calculate_cci(df, period: int = 20):
    typical_price = (df['high'] + df['low'] + df['close']) / 3
    sma = typical_price.rolling(window=period).mean()
    mad = typical_price.rolling(window=period).apply(lambda x: (x - x.mean()).abs().mean())
    cci = (typical_price - sma) / (0.015 * mad)
    return cci

def calculate_vwap(df):
    cum_vol_price = (df['close'] * df['volume']).cumsum()
    cum_volume = df['volume'].cumsum()
    vwap = cum_vol_price / cum_volume
    return vwap

def calculate_obv(df):
    obv = (df['volume'] * ((df['close'].diff() > 0).astype(int) - (df['close'].diff() < 0).astype(int))).cumsum()
    return obv
