@echo off
echo ========================================
echo VanVyapaar - Add Products for Seller 8
echo ========================================
echo.

echo This will add 35 products for Seller ID 8
echo Categories: Wood Crafts, Handicrafts, Textiles, Pottery, Jewelry, Home Decor, Kitchen
echo.

set /p CONFIRM="Continue? (Y/N): "
if /i "%CONFIRM%" NEQ "Y" (
    echo Cancelled.
    exit /b
)

echo.
echo Adding products to database...
echo.

mysql -u root -pprasad777 vanvyaapaar < vanpaayaar-backend\src\main\resources\sample-products-seller8.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! 35 products added for Seller 8
    echo ========================================
    echo.
    echo Verifying...
    mysql -u root -pprasad777 vanvyaapaar -e "SELECT category, COUNT(*) as count FROM products WHERE seller_id = 8 GROUP BY category;"
    echo.
    echo Total products for Seller 8:
    mysql -u root -pprasad777 vanvyaapaar -e "SELECT COUNT(*) as total FROM products WHERE seller_id = 8;"
    echo.
    echo Done! Check your frontend at http://localhost:5173/products
) else (
    echo.
    echo ========================================
    echo ERROR! Failed to add products.
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Database 'vanvyaapaar' exists
    echo 3. Seller with ID 8 exists
    echo.
    echo Run this to check seller:
    echo mysql -u root -pprasad777 vanvyaapaar -e "SELECT id, name FROM sellers WHERE id = 8;"
)

echo.
pause
