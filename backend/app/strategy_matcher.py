from .indicators import calculate_rsi, calculate_macd

def match_rules(df, rules: list):
    results = []
    for ind, op, thr in rules:
        if ind == 'RSI': val = calculate_rsi(df).iloc[-1]
        elif ind == 'MACD': val = calculate_macd(df)[0].iloc[-1]
        else: continue
        if not eval(f"{val}{op}{thr}"): return False
    return True
