from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import analyze

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için açık tuttuk
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router ekle
app.include_router(analyze.router)

@app.get("/")
def read_root():
    return {"status": "ok"}
