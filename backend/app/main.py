from fastapi import FastAPI
from .routers.webhook import router as webhook_router

app = FastAPI(title="Trade Analyzer")
app.include_router(webhook_router, prefix="/api")

@app.get("/health")
def health(): return {"status":"ok"}
