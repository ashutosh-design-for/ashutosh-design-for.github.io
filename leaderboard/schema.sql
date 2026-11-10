CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  at TEXT NOT NULL,
  ip_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS scores_by_score ON scores (score DESC);
CREATE INDEX IF NOT EXISTS scores_by_ip_time ON scores (ip_hash, at);

/* Contact form inquiries from the portfolio. Read them with:
   wrangler d1 execute nightdrive --remote --command "SELECT * FROM inquiries ORDER BY at DESC LIMIT 20" */
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  page TEXT NOT NULL,
  at TEXT NOT NULL,
  ip_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS inquiries_by_ip_time ON inquiries (ip_hash, at);
