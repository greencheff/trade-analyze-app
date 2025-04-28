# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.analyze import router as analyze_router  # routers doğru oldu!

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Trade Analyze API çalışıyor."}

# Analyze router'ı /api prefix'i ile bağlıyoruz
app.include_router(analyze_router, prefix="/api")
