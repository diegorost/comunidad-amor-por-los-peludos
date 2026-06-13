CREATE TABLE tips_new (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  image_url TEXT,
  text TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO tips_new SELECT id, title, image_url, text, created_at FROM tips;

DROP TABLE tips;

ALTER TABLE tips_new RENAME TO tips;
