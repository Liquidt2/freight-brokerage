/*
  # Blog System Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    
    - `posts`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `image_url` (text)
      - `author_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `published` (boolean)
      - `read_time` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `authors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `avatar_url` (text)
      - `bio` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Add policies for public read access to published posts
*/

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  image_url text,
  author_id uuid REFERENCES authors(id),
  category_id uuid REFERENCES categories(id),
  published boolean DEFAULT false,
  read_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
  ON categories
  USING (auth.role() = 'authenticated');

-- Policies for authors
CREATE POLICY "Allow public read access to authors"
  ON authors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage authors"
  ON authors
  USING (auth.role() = 'authenticated');

-- Policies for posts
CREATE POLICY "Allow public read access to published posts"
  ON posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Allow authenticated users to manage posts"
  ON posts
  USING (auth.role() = 'authenticated');

-- Create functions for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();