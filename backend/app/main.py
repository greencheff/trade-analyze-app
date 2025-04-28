# backend/app/main.py

from fastapi import FastAPI
from app.routes import analyze

app = FastAPI()

# Ana route olarak "/api" altında analyze route'unu dahil ediyoruz
app.include_router(analyze.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Trade Analyze Backend API Çalışıyor."}
