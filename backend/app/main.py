from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.analyze import router as analyze_router
from app.routers.indicators_router import router as indicators_router  
from app.routers.strategy_router import router as strategy_router

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

# Analyze router'ı "/api" prefix'i ile bağlıyoruz
app.include_router(analyze_router, prefix="/api")

# Yeni Indicators router'ı "/api" prefix'i ile bağlıyoruz
app.include_router(indicators_router, prefix="/api")

app.include_router(strategy_router, prefix="/api")
