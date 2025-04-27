# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze  # düzeltildi!

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ı ekle
app.include_router(analyze.router)

@app.get("/")
def read_root():
    return {"status": "ok"}
