from pydantic import BaseModel
from typing import List, Dict, Any, Literal

class WebhookPayload(BaseModel):
    symbol: str
    interval: str
    candles: List[Dict[str, Any]]

class FeedbackResponse(BaseModel):
    event_id: int
    summary: str
    score: float

class StrategyRequest(BaseModel):
    candles: List[Dict[str, Any]]
    strategy: Literal[
        "rsi_divergence",
        "mtf_confirmation",
        "orderblock_rsi_divergence",
        "bollinger_breakout",
        "breakout_volume",
        "ema_ribbon",
        "stochastic_rsi_momentum",
        "keltner_breakout",
        "pivot_point",
        "liquidity_sweep_bos"
    ]
