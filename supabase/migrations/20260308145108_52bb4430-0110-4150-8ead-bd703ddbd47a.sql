
CREATE TABLE public.saints_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_month integer NOT NULL CHECK (date_month BETWEEN 1 AND 12),
  date_day integer NOT NULL CHECK (date_day BETWEEN 1 AND 31),
  saint_name text NOT NULL,
  description text,
  image_url text,
  article_slug text,
  article_category text DEFAULT 'santos-e-oracoes',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (date_month, date_day, saint_name)
);

ALTER TABLE public.saints_calendar ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read saints calendar"
  ON public.saints_calendar FOR SELECT
  USING (true);

-- Auth insert/update/delete
CREATE POLICY "Auth can insert saints"
  ON public.saints_calendar FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth can update saints"
  ON public.saints_calendar FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Auth can delete saints"
  ON public.saints_calendar FOR DELETE
  TO authenticated
  USING (true);
