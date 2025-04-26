from fastapi import FastAPI
from .routers.webhook import router as webhook_router
from app.routers import analyze

app = FastAPI(title="Trade Analyzer")

# Webhook router
app.include_router(webhook_router, prefix="/api")

# Analyze router
app.include_router(analyze.router, prefix="/api")

# Healthcheck endpoint
@app.get("/health")
def health():
    return {"status": "ok"}
