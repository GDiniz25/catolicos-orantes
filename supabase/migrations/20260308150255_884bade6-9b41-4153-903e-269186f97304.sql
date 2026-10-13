ALTER TABLE public.saints_calendar
ADD COLUMN IF NOT EXISTS full_content text,
ADD COLUMN IF NOT EXISTS vatican_url text,
ADD COLUMN IF NOT EXISTS scraped_at timestamp with time zone;