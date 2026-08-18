GRANT INSERT ON public.contacts TO anon, authenticated;
CREATE POLICY "Visitantes podem se cadastrar" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);