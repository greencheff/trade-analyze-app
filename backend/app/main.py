# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze  

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ı ekle (BURAYA DİKKAT: prefix="/api")
app.include_router(analyze.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok"}
