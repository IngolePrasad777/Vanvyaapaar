-- Fix for null orderDate values in orders table
-- This script will update all orders with null orderDate to current timestamp

-- First, let's see how many orders have null orderDate
SELECT COUNT(*) as null_order_dates FROM orders WHERE order_date IS NULL;

-- Update null orderDate values to current timestamp
UPDATE orders 
SET order_date = NOW() 
WHERE order_date IS NULL;

-- Verify the fix
SELECT COUNT(*) as remaining_null_dates FROM orders WHERE order_date IS NULL;

-- Show sample of updated orders
SELECT id, status, total_amount, order_date, buyer_id 
FROM orders 
ORDER BY id DESC 
LIMIT 10;