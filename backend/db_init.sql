CREATE TABLE webhook_events (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20),
  interval VARCHAR(10),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES webhook_events(id),
  summary TEXT,
  score REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
