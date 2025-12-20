-- ============================================
-- VanVyaapaar - Create Admin Account
-- ============================================
-- Run this SQL script in your MySQL/PostgreSQL database
-- to create an admin account
-- ============================================

-- Step 1: Insert into base table
INSERT INTO basetable (name, email, password, confirm_password, phone, address, pincode, created_at)
VALUES (
  'Admin VanVyaapaar',                    -- Admin name
  'admin@vanvyaapaar.com',        -- Admin email (use this to login)
  '123456',                      -- Password (CHANGE THIS!)
  '123456',                      -- Confirm password
  '9529963624',                    -- Phone number
  'Admin Office, Pune',           -- Address
  '412105',                        -- Pincode
  NOW()                            -- Created timestamp
);

-- Step 2: Get the ID of the inserted record
SET @admin_id = LAST_INSERT_ID();

-- Step 3: Insert into admins table (links to base table)
INSERT INTO admins (user_id)
VALUES (@admin_id);

-- Step 4: Verify the admin was created successfully
SELECT 
  b.id,
  b.name,
  b.email,
  b.phone,
  b.address,
  b.created_at,
  a.user_id as admin_user_id
FROM basetable b 
JOIN admins a ON b.id = a.user_id 
WHERE b.email = 'admin@vanvyaapaar.com';

-- ============================================
-- ADMIN LOGIN CREDENTIALS
-- ============================================
-- Email: admin@vanvyaapaar.com
-- Password: admin123
-- Role: ADMIN
-- 
-- Login URL: http://localhost:5173/login?admin=true
-- ============================================

-- ============================================
-- SECURITY NOTE
-- ============================================
-- ⚠️ IMPORTANT: Change the password 'admin123' to a strong password!
-- ⚠️ In production, passwords should be hashed (bcrypt)
-- ⚠️ This script uses plain text for development only
-- ============================================

-- ============================================
-- OPTIONAL: Create additional admin accounts
-- ============================================

-- Example: Create a second admin
/*
INSERT INTO basetable (name, email, password, confirm_password, phone, address, pincode, created_at)
VALUES (
  'Super Admin',
  'superadmin@vanvyaapaar.com',
  'super123',
  'super123',
  '9876543211',
  'Head Office, Mumbai',
  '400001',
  NOW()
);

SET @admin_id2 = LAST_INSERT_ID();

INSERT INTO admins (user_id)
VALUES (@admin_id2);
*/

-- ============================================
-- CLEANUP (if needed)
-- ============================================
-- To delete an admin account:
/*
DELETE a FROM admins a
JOIN basetable b ON a.user_id = b.id
WHERE b.email = 'admin@vanvyaapaar.com';

DELETE FROM basetable 
WHERE email = 'admin@vanvyaapaar.com';
*/
