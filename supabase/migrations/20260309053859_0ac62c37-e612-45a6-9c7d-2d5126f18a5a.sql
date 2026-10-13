
CREATE TABLE public.user_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  whatsapp text,
  category text NOT NULL,
  content_reference text,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit suggestions
CREATE POLICY "Anyone can insert suggestions"
  ON public.user_suggestions
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Authenticated can read suggestions"
  ON public.user_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated can update suggestions"
  ON public.user_suggestions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated can delete suggestions"
  ON public.user_suggestions
  FOR DELETE
  TO authenticated
  USING (true);
