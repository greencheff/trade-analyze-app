# /backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.analyze import router as analyze_router  # analyze router'ı import ediyoruz

app = FastAPI()

# CORS ayarları (frontend'den rahat istek atabilelim diye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Gerekirse sadece frontend URL'ini verebilirsin güvenlik için
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API kök endpointi
@app.get("/")
async def root():
    return {"message": "Trade Analyze API çalışıyor."}

# Analyze route'unu "/api" prefix'i ile ekle
app.include_router(analyze_router, prefix="/api")
