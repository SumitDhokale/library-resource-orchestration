
UPDATE user_profiles
SET role = 'admin', updated_at = TIMEZONE('utc', NOW())
WHERE email = 'your-admin-email@example.com';

UPDATE user_profiles
SET role = 'librarian', updated_at = TIMEZONE('utc', NOW())
WHERE id = 'USER_UUID';

UPDATE user_profiles
SET role = 'user', updated_at = TIMEZONE('utc', NOW())
WHERE id = 'USER_UUID';

INSERT INTO user_profiles (id, name, email, role, created_at, updated_at)
VALUES ('USER_UUID', 'Alice Admin', 'alice@example.com', 'admin', TIMEZONE('utc', NOW()), TIMEZONE('utc', NOW()));

CREATE OR REPLACE FUNCTION public.set_user_role(target_id UUID, new_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF new_role NOT IN ('admin', 'librarian', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  UPDATE user_profiles
  SET role = new_role, updated_at = TIMEZONE('utc', NOW())
  WHERE id = target_id;
END;
$$;

