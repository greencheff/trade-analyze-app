from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.webhook import router as webhook_router
from app.routers import analyze

app = FastAPI(title="Trade Analyzer")

# CORS Middleware ekliyoruz
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Buraya güvenilir domain ekleyebilirsin örnek: ["https://trade-analyze-app-1.onrender.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook_router, prefix="/api")
app.include_router(analyze.router)

@app.get("/health")
def health():
    return {"status": "ok"}
