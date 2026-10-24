BEGIN;
CREATE TABLE IF NOT EXISTS lab11_sessions (
  owner_hash text PRIMARY KEY CHECK (owner_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  window_started timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0)
);
CREATE TABLE IF NOT EXISTS lab11_personas (
  id uuid PRIMARY KEY,
  owner_hash text NOT NULL REFERENCES lab11_sessions(owner_hash) ON DELETE CASCADE,
  first_name varchar(60) NOT NULL,
  last_name varchar(60) NOT NULL,
  email varchar(120) NOT NULL CHECK (email LIKE '%@example.com'),
  phone varchar(9) CHECK (phone IS NULL OR phone ~ '^000[0-9]{6}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (owner_hash, email)
);
CREATE INDEX IF NOT EXISTS lab11_personas_owner_created_idx ON lab11_personas(owner_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS lab11_sessions_expiry_idx ON lab11_sessions(expires_at);
COMMENT ON TABLE lab11_personas IS 'Laboratorio académico DS3031: exclusivamente datos ficticios.';
COMMIT;
