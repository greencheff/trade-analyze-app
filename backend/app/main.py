# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze

app = FastAPI()

# CORS ayarları (frontend ile backend iletişimi için gerekli)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prod ortamda burayı spesifik site adresi ile değiştirmen iyi olur
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ı ekle
app.include_router(analyze.router)

@app.get("/")
def read_root():
    return {"status": "ok"}
