from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import analyze

app = FastAPI()

# CORS ayarları (frontend ile backend iletişimi için gerekli)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prod ortamında burayı değiştirirsin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ı ekle
app.include_router(analyze.router)

@app.get("/")
def read_root():
    return {"status": "ok"}
