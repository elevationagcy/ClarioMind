-- Make a user admin
-- Replace 'your-email@example.com' with the actual email

UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'your-email@example.com' 
  LIMIT 1
);

-- Verify the update
SELECT 
  u.email, 
  p.role 
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE p.role = 'admin';

