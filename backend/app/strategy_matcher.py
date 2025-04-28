# backend/app/strategy_matcher.py

def run_all_strategies(df):
    results = []

    try:
        if 'rsi' in df.columns:
            rsi_value = df['rsi'].iloc[-1]
            if rsi_value < 30:
                results.append({
                    "name": "RSI Aşırı Satım",
                    "description": "RSI değeri 30'un altında. Alım fırsatı olabilir."
                })
            elif rsi_value > 70:
                results.append({
                    "name": "RSI Aşırı Alım",
                    "description": "RSI değeri 70'in üzerinde. Dikkatli olunmalı."
                })

        if 'adx' in df.columns:
            adx_value = df['adx'].iloc[-1]
            if adx_value > 25:
                results.append({
                    "name": "ADX Güçlü Trend",
                    "description": "ADX 25'in üzerinde. Piyasada güçlü bir trend olabilir."
                })

        if 'macd' in df.columns:
            macd_value = df['macd'].iloc[-1]
            if macd_value > 0:
                results.append({
                    "name": "MACD Pozitif",
                    "description": "MACD sıfırın üstünde. Yukarı yönlü momentum güçlü."
                })
            else:
                results.append({
                    "name": "MACD Negatif",
                    "description": "MACD sıfırın altında. Aşağı yönlü momentum güçlü."
                })

    except Exception as e:
        print(f"Strateji çalıştırılırken hata oluştu: {e}")

    return results
