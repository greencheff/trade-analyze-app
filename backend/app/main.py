# backend/app/main.py

from fastapi import FastAPI
from app.routes import analyze

app = FastAPI()

app.include_router(analyze.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Trade Analyze Backend Çalışıyor."}
