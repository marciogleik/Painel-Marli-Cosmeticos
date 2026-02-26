
-- Add missing storage policies for avatars bucket (some already exist)
DO $$
BEGIN
  -- Try creating select policy
  BEGIN
    CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- Try creating insert policy
  BEGIN
    CREATE POLICY "Authenticated users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- Try creating delete policy
  BEGIN
    CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
