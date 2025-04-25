from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db, Base, engine
from ..models import WebhookEvent, Feedback
from ..schemas import WebhookPayload, FeedbackResponse
from ..indicators import df_from_candles
from ..strategy_signal_scanner import scan_signal
from ..telegram_bot import send_message

router = APIRouter()
Base.metadata.create_all(bind=engine)

@router.post("/webhook", response_model=FeedbackResponse)
def process_webhook(payload: WebhookPayload, db: Session = Depends(get_db)):
    event = WebhookEvent(symbol=payload.symbol, interval=payload.interval, payload=payload.dict())
    db.add(event); db.commit(); db.refresh(event)
    df = df_from_candles(payload.candles)
    passed = scan_signal(df, "RSI<30&&MACD>0")
    summary = "Momentum Long" if passed else "No Signal"
    score = 1.0 if passed else 0.5
    fb = Feedback(event_id=event.id, summary=summary, score=score)
    db.add(fb); db.commit()
    send_message(f"{payload.symbol}-{payload.interval}: {summary}")
    return FeedbackResponse(event_id=event.id, summary=summary, score=score)
