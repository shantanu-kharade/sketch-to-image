-- Create a table for storing sketch metadata
CREATE TABLE IF NOT EXISTS sketches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users (id)
    ON DELETE CASCADE
);

-- Create an index for faster querying by user_id
CREATE INDEX IF NOT EXISTS idx_sketches_user_id ON sketches (user_id);

-- Create a view that only shows a user their own sketches
CREATE OR REPLACE VIEW user_sketches AS
  SELECT * FROM sketches
  WHERE user_id = auth.uid();

-- Row Level Security (RLS) policies
-- Enable RLS
ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own sketches
CREATE POLICY "Users can view their own sketches"
  ON sketches
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policy to allow users to insert their own sketches
CREATE POLICY "Users can insert their own sketches"
  ON sketches
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policy to allow users to update their own sketches
CREATE POLICY "Users can update their own sketches"
  ON sketches
  FOR UPDATE
  USING (user_id = auth.uid());

-- Create policy to allow users to delete their own sketches
CREATE POLICY "Users can delete their own sketches"
  ON sketches
  FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sketches_updated_at
BEFORE UPDATE ON sketches
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Storage Bucket Configuration
-- This needs to be done in Supabase dashboard, but here's a guideline:
-- 1. Create a bucket named 'sketches'
-- 2. Set permissions to allow authenticated users to upload to their own folder (user_id)
-- 3. Set public access level appropriately 