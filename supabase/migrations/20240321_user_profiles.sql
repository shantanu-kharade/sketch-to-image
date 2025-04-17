-- Create a secure schema for user-related tables
CREATE SCHEMA IF NOT EXISTS user_management;

-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create a table for user profiles
CREATE TABLE IF NOT EXISTS user_management.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  preferences JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Enable Row Level Security
ALTER TABLE user_management.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON user_management.user_profiles (username);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_management.user_profiles (email);

-- Create or replace function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_management.user_profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policies for user_profiles table
-- Allow users to read their own profile
CREATE POLICY "Users can view their own profile" 
  ON user_management.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
  ON user_management.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow authorized users to read any profile (for administrators)
CREATE POLICY "Admins can view all profiles" 
  ON user_management.user_profiles 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Create a view that joins user profile data with user authentication data (useful for admin interfaces)
CREATE OR REPLACE VIEW user_management.users_view AS
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    u.confirmed_at,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.preferences
  FROM auth.users u
  LEFT JOIN user_management.user_profiles p ON u.id = p.id;

-- Grant access to the view for authenticated users
GRANT SELECT ON user_management.users_view TO authenticated;

-- Create a secure storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create a policy to allow users to update/delete their own avatars
CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create a policy to allow public access to read avatars
CREATE POLICY "Public can read avatars"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Create a function to get a user's profile by their ID
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS SETOF user_management.user_profiles
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM user_management.user_profiles
  WHERE id = user_id
$$;

-- Create a function to update a user's profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  new_username TEXT DEFAULT NULL,
  new_full_name TEXT DEFAULT NULL,
  new_bio TEXT DEFAULT NULL,
  new_avatar_url TEXT DEFAULT NULL
)
RETURNS SETOF user_management.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF new_username IS NOT NULL AND EXISTS (
    SELECT 1 FROM user_management.user_profiles WHERE username = new_username AND id != user_id
  ) THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;

  RETURN QUERY
  UPDATE user_management.user_profiles
  SET
    username = COALESCE(new_username, username),
    full_name = COALESCE(new_full_name, full_name),
    bio = COALESCE(new_bio, bio),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    updated_at = now()
  WHERE id = user_id
  RETURNING *;
END;
$$; 