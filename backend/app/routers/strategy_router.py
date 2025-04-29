from fastapi import APIRouter, HTTPException
from app.schemas import StrategyRequest
import pandas as pd
from app.strategy_signal_scanner import analyze_rsi_divergence_strategy

router = APIRouter()

@router.post("/strategy-signal")
async def strategy_signal(payload: StrategyRequest):
    try:
        # Gönderilen candle verisini DataFrame'e çevir
        df = pd.DataFrame(
            payload.candles,
            columns=["timestamp", "open", "high", "low", "close", "volume"]
        )
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)
        df = df.astype(float)

        # Seçilen stratejiye göre çalıştır
        if payload.strategy == "rsi_divergence":
            result = analyze_rsi_divergence_strategy(df)
        else:
            # Diğer stratejileri de burada ekleyebilirsin
            raise HTTPException(
                status_code=404,
                detail=f"Strateji '{payload.strategy}' henüz desteklenmiyor."
            )

        return {"strategy_result": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
