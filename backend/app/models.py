from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from sqlalchemy.sql import func

from .database import Base

class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    interval = Column(String)
    payload = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer)
    summary = Column(String)
    score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
