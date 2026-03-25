-- Fix for RLS Policy Infinite Recursion
-- Run this in Supabase SQL Editor AFTER the main schema.sql

-- Drop problematic policies that cause circular references
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Librarians and admins can insert books" ON books;
DROP POLICY IF EXISTS "Librarians and admins can update books" ON books;
DROP POLICY IF EXISTS "Admins can delete books" ON books;
DROP POLICY IF EXISTS "Librarians and admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Librarians and admins can manage transactions" ON transactions;
DROP POLICY IF EXISTS "Librarians and admins can manage digital resources" ON digital_resources;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Librarians and admins can manage reservations" ON book_reserves;

-- Create a security definer function to check user roles
-- This function runs with elevated privileges and doesn't trigger RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid();

  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Recreate policies using the security definer function
-- This avoids circular references

-- User profiles policies (simplified)
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policies using the function
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (public.get_user_role() = 'admin');

-- Books policies
CREATE POLICY "Anyone can view books" ON books FOR SELECT USING (true);

CREATE POLICY "Librarians and admins can insert books" ON books
  FOR INSERT WITH CHECK (public.get_user_role() IN ('librarian', 'admin'));

CREATE POLICY "Librarians and admins can update books" ON books
  FOR UPDATE USING (public.get_user_role() IN ('librarian', 'admin'));

CREATE POLICY "Admins can delete books" ON books
  FOR DELETE USING (public.get_user_role() = 'admin');

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Librarians and admins can view all transactions" ON transactions
  FOR SELECT USING (public.get_user_role() IN ('librarian', 'admin'));

CREATE POLICY "Librarians and admins can manage transactions" ON transactions
  FOR ALL USING (public.get_user_role() IN ('librarian', 'admin'));

-- Digital resources policies
CREATE POLICY "Anyone can view digital resources" ON digital_resources FOR SELECT USING (true);

CREATE POLICY "Librarians and admins can manage digital resources" ON digital_resources
  FOR ALL USING (public.get_user_role() IN ('librarian', 'admin'));

-- Activity logs policies
CREATE POLICY "Admins can view all activity logs" ON activity_logs
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "System can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Book reservations policies
CREATE POLICY "Users can view their own reservations" ON book_reserves
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON book_reserves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own reservations" ON book_reserves
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Librarians and admins can manage reservations" ON book_reserves
  FOR ALL USING (public.get_user_role() IN ('librarian', 'admin'));