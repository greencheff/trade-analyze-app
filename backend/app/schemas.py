from pydantic import BaseModel
from typing import List, Dict, Any

class WebhookPayload(BaseModel):
    symbol: str
    interval: str
    candles: List[Dict[str, Any]]

class FeedbackResponse(BaseModel):
    event_id: int
    summary: str
    score: float
