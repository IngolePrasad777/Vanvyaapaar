# 🎨 Add Sample Products Guide

## 📦 What's Included

35 sample tribal craft products across 7 categories:
- **Wood Crafts** (5 products)
- **Handicrafts** (5 products)
- **Textiles** (5 products)
- **Pottery** (5 products)
- **Jewelry** (5 products)
- **Home Decor** (5 products)

All products have:
- ✅ Real product images from Unsplash
- ✅ Detailed descriptions
- ✅ Realistic pricing (₹399 - ₹3499)
- ✅ Stock quantities
- ✅ Featured flags for homepage display

---

## 🚀 Method 1: Using SQL (FASTEST)

### Step 1: Check Your Seller ID
```sql
SELECT id, name, email FROM sellers;
```

### Step 2: Update SQL File (if needed)
If your seller ID is NOT 3, open `vanpaayaar-backend/src/main/resources/sample-products.sql` and replace all `seller_id = 3` with your actual seller ID.

### Step 3: Run SQL Script
```bash
# Option A: Using MySQL Command Line
mysql -u root -p vanvyaapaar < vanpaayaar-backend/src/main/resources/sample-products.sql

# Option B: Using MySQL Workbench
# 1. Open MySQL Workbench
# 2. File → Open SQL Script
# 3. Select sample-products.sql
# 4. Click Execute (⚡ icon)
```

### Step 4: Verify
```sql
SELECT category, COUNT(*) as product_count 
FROM products 
GROUP BY category;
```

You should see:
```
+-------------+---------------+
| category    | product_count |
+-------------+---------------+
| Wood Crafts |             5 |
| Handicrafts |             5 |
| Textiles    |             5 |
| Pottery     |             5 |
| Jewelry     |             5 |
| Home Decor  |             5 |
+-------------+---------------+
```

---

## 🔧 Method 2: Using Postman

### Step 1: Import Collection
1. Open Postman
2. Click **Import**
3. Select `vanpaayaar-backend/src/main/resources/postman-add-products.json`

### Step 2: Set Variables
1. Click on the collection
2. Go to **Variables** tab
3. Set `baseUrl` = `http://localhost:8080`
4. Set `sellerId` = `3` (or your seller ID)

### Step 3: Run Requests
1. Expand each category folder
2. Click on each request
3. Click **Send**
4. Verify you get `201 Created` response

**Note**: You'll need to manually send each request (35 total). SQL method is faster!

---

## 🌐 Method 3: Using cURL (Command Line)

### Example: Add One Product
```bash
curl -X POST http://localhost:8080/seller/3/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Handcrafted Wooden Bowl",
    "description": "Beautiful hand-carved wooden bowl made from sustainable teak wood.",
    "category": "Wood Crafts",
    "price": 1299.00,
    "stock": 25,
    "imageUrl": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    "featured": true
  }'
```

**Note**: You'd need to run this 35 times with different data. SQL method is much faster!

---

## ✅ Verification

### Check Products in Database
```sql
-- Count by category
SELECT category, COUNT(*) as count FROM products GROUP BY category;

-- View all products
SELECT id, name, category, price, stock, featured FROM products;

-- View featured products
SELECT name, category, price FROM products WHERE featured = true;
```

### Check in Frontend
1. Go to `http://localhost:5173/products`
2. You should see all 35 products
3. Filter by category to see 5 products each
4. Featured products should appear on homepage

---

## 🎯 Quick Start (Recommended)

**If you have seller ID 3:**
```bash
mysql -u root -pprasad777 vanvyaapaar < vanpaayaar-backend/src/main/resources/sample-products.sql
```

**If you have different seller ID:**
1. Open `sample-products.sql`
2. Find & Replace: `seller_id = 3` → `seller_id = YOUR_ID`
3. Run the SQL script

**Done!** 🎉 You now have 35 beautiful tribal craft products in your database.

---

## 📸 Image Sources

All images are from Unsplash (free to use):
- High quality product photos
- Royalty-free
- No attribution required
- Direct URLs (no download needed)

---

## 🔄 Reset Products (if needed)

```sql
-- Delete all products
DELETE FROM products;

-- Reset auto-increment
ALTER TABLE products AUTO_INCREMENT = 1;

-- Then run the SQL script again
```

---

## 💡 Tips

1. **SQL Method is Fastest**: Adds all 35 products in seconds
2. **Check Seller ID First**: Make sure seller with ID 3 exists
3. **Images Load from Unsplash**: No need to download/upload
4. **Featured Products**: 12 products marked as featured for homepage
5. **Realistic Data**: Prices, descriptions, and stock are realistic

---

## 🐛 Troubleshooting

### Error: "Seller not found"
- Check your seller ID: `SELECT id FROM sellers;`
- Update SQL file with correct seller_id

### Error: "Duplicate entry"
- Products already exist
- Run: `DELETE FROM products WHERE seller_id = 3;`
- Then run SQL script again

### Images not loading
- Check internet connection
- Unsplash URLs are public and should work
- If blocked, replace with your own image URLs

---

## 📊 Product Categories

| Category     | Products | Price Range    | Featured |
|-------------|----------|----------------|----------|
| Wood Crafts | 5        | ₹1,299-₹3,499 | 3        |
| Handicrafts | 5        | ₹699-₹1,999   | 3        |
| Textiles    | 5        | ₹699-₹2,999   | 3        |
| Pottery     | 5        | ₹399-₹2,499   | 2        |
| Jewelry     | 5        | ₹499-₹3,499   | 2        |
| Home Decor  | 5        | ₹599-₹2,299   | 2        |

**Total**: 35 products, 15 featured

---

**Ready to add products? Use the SQL method for fastest results!** 🚀
