-- Enable pg_cron extension (must be enabled in Supabase dashboard under Extensions first)
-- create extension if not exists pg_cron;

-- Ensure the ebook_downloads table exists
CREATE TABLE IF NOT EXISTS ebook_downloads (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  download_count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial row if not present
INSERT INTO ebook_downloads (slug, title, download_count)
VALUES ('cyberbezpieczenstwo', 'Safe Labs - Cyberbezpieczenstwo', 0)
ON CONFLICT (slug) DO NOTHING;

-- Function to increment download count by a random amount (50–100)
CREATE OR REPLACE FUNCTION increment_ebook_downloads_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_increment INTEGER;
BEGIN
  v_increment := floor(random() * 51 + 50)::INTEGER; -- random 50..100

  UPDATE ebook_downloads
  SET
    download_count = download_count + v_increment,
    updated_at = NOW()
  WHERE slug = 'cyberbezpieczenstwo';
END;
$$;

-- RPC helper used by the Edge Function alternative
CREATE OR REPLACE FUNCTION increment_ebook_downloads_by(p_slug TEXT, p_amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ebook_downloads
  SET
    download_count = download_count + p_amount,
    updated_at = NOW()
  WHERE slug = p_slug;
END;
$$;

-- Schedule the function to run every day at midnight UTC
-- Requires pg_cron to be enabled in Supabase dashboard (Database > Extensions > pg_cron)
SELECT cron.schedule(
  'daily-ebook-increment',   -- job name (unique)
  '0 0 * * *',               -- cron: midnight every day
  'SELECT increment_ebook_downloads_daily()'
);
