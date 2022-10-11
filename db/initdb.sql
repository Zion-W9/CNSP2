CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  password TEXT
);

CREATE TABLE IF NOT EXISTS todos (
  ID SERIAL PRIMARY KEY,
  text TEXT,
  username TEXT REFERENCES users (username),
  done BOOLEAN
);

INSERT INTO users (username, password) VALUES ('alice', 'wonderland')
ON CONFLICT DO NOTHING;