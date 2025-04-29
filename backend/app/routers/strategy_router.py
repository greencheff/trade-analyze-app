from fastapi import APIRouter, HTTPException
from app.schemas import StrategyRequest
import pandas as pd

from app.strategy_signal_scanner import (
    analyze_rsi_divergence_strategy,
    analyze_mtf_confirmation_strategy,
    analyze_orderblock_rsi_divergence_strategy,
    analyze_bollinger_breakout_strategy,
    analyze_breakout_volume_strategy,
    analyze_ema_ribbon_strategy,
    analyze_stochastic_rsi_momentum_strategy,
    analyze_keltner_breakout_strategy,
    analyze_pivot_point_strategy,
    analyze_liquidity_sweep_bos_strategy,
)

router = APIRouter()

@router.post("/strategy-signal")
async def strategy_signal(payload: StrategyRequest):
    # Candles → DataFrame
    df = pd.DataFrame(
        payload.candles,
        columns=["timestamp", "open", "high", "low", "close", "volume"]
    )
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df.set_index("timestamp", inplace=True)
    df = df.astype(float)

    # Strategy → fonksiyon map’i
    mapping = {
        "rsi_divergence": analyze_rsi_divergence_strategy,
        "mtf_confirmation": analyze_mtf_confirmation_strategy,
        "orderblock_rsi_divergence": analyze_orderblock_rsi_divergence_strategy,
        "bollinger_breakout": analyze_bollinger_breakout_strategy,
        "breakout_volume": analyze_breakout_volume_strategy,
        "ema_ribbon": analyze_ema_ribbon_strategy,
        "stochastic_rsi_momentum": analyze_stochastic_rsi_momentum_strategy,
        "keltner_breakout": analyze_keltner_breakout_strategy,
        "pivot_point": analyze_pivot_point_strategy,
        "liquidity_sweep_bos": analyze_liquidity_sweep_bos_strategy,
    }

    if payload.strategy not in mapping:
        raise HTTPException(404, f"Strateji '{payload.strategy}' henüz desteklenmiyor.")
    result = mapping[payload.strategy](df)
    return {"strategy_result": result}
