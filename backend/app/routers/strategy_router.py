from fastapi import APIRouter, HTTPException
from app.schemas import StrategyRequest
import pandas as pd

from app.strategy_signal_scanner import (
    analyze_rsi_divergence_strategy,
    analyze_mtf_confirmation_strategy,
    analyze_orderblock_rsi_divergence_strategy,
    analyze_bollinger_breakout_strategy,
    analyze_breakout_volume_strategy,
)

router = APIRouter()

@router.post("/strategy-signal")
async def strategy_signal(payload: StrategyRequest):
    # DataFrame'e dönüştür
    df = pd.DataFrame(
        payload.candles,
        columns=["timestamp", "open", "high", "low", "close", "volume"]
    )
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df.set_index("timestamp", inplace=True)
    df = df.astype(float)

    # Hangi stratejiye çalışılacak?
    if payload.strategy == "rsi_divergence":
        result = analyze_rsi_divergence_strategy(df)
    elif payload.strategy == "mtf_confirmation":
        result = analyze_mtf_confirmation_strategy(df)
    elif payload.strategy == "orderblock_rsi_divergence":
        result = analyze_orderblock_rsi_divergence_strategy(df)
    elif payload.strategy == "bollinger_breakout":
        result = analyze_bollinger_breakout_strategy(df)
    elif payload.strategy == "breakout_volume":
        result = analyze_breakout_volume_strategy(df)
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Strateji '{payload.strategy}' henüz desteklenmiyor."
        )

    return {"strategy_result": result}
