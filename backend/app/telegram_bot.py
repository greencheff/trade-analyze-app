import requests
from .config import settings

BASE = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}"
def send_message(text: str):
    requests.post(f"{BASE}/sendMessage", json={"chat_id": settings.TELEGRAM_CHAT_ID, "text": text})
