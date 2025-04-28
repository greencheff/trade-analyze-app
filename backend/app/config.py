# backend/app/config.py

import os
from typing import Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    REDIS_URL: Optional[str] = None      # ↓ opsiyonel yaptık
    TRADINGVIEW_API_KEY: str
    BINANCE_API_KEY: str
    BINANCE_API_SECRET: str
    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_CHAT_ID: str

    class Config:
        env_file = ".env"

settings = Settings()
