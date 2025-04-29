 from fastapi import APIRouter, HTTPException
-from pydantic import BaseModel
-from typing import List, Literal
+from pydantic import BaseModel
+from typing import List, Literal
 import pandas as pd
 from app.strategy_signal_scanner import analyze_rsi_divergence_strategy

 router = APIRouter()

 class Candle(BaseModel):
     timestamp: int
     open: float
     high: float
     low: float
     close: float
     volume: float

-class StrategyRequest(BaseModel):
-    candles: List[Candle]
-    strategy: Literal["RSI Diverjans (Uyumsuzluk) Stratejisi"]
+class StrategyRequest(BaseModel):
+    candles: List[Candle]
+    strategy: Literal[
+        "rsi_divergence",
+        "mtf_confirmation",
+        "orderblock_rsi_divergence",
+        "bollinger_breakout",
+        "breakout_volume"
+    ]

 @router.post("/strategy-signal")
 async def strategy_signal(request: StrategyRequest):
     df = pd.DataFrame([c.dict() for c in request.candles])

-    if request.strategy == "RSI Diverjans (Uyumsuzluk) Stratejisi":
-        result = analyze_rsi_divergence_strategy(df)
+    if request.strategy == "rsi_divergence":
+        result = analyze_rsi_divergence_strategy(df)
     else:
         raise HTTPException(status_code=400, detail="Strateji tanınmadı.")

     return {"strategy_result": result}
