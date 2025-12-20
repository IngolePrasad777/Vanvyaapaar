@echo off
echo ========================================
echo VanVyapaar - Add Sample Products
echo ========================================
echo.

echo This will add 35 sample tribal craft products to your database.
echo.

set /p CONFIRM="Continue? (Y/N): "
if /i "%CONFIRM%" NEQ "Y" (
    echo Cancelled.
    exit /b
)

echo.
echo Adding products to database...
echo.

mysql -u root -pprasad777 vanvyaapaar < vanpaayaar-backend\src\main\resources\sample-products.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! 35 products added.
    echo ========================================
    echo.
    echo Verifying...
    mysql -u root -pprasad777 vanvyaapaar -e "SELECT category, COUNT(*) as count FROM products GROUP BY category;"
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
    echo 3. Seller with ID 3 exists
    echo.
    echo Run this to check seller:
    echo mysql -u root -pprasad777 vanvyaapaar -e "SELECT id, name FROM sellers;"
)

echo.
pause
