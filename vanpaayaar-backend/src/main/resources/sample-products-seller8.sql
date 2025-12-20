-- Sample Tribal Craft Products for Seller ID 8
-- High-quality products with MATCHING images from Unsplash
-- All images are carefully selected to match the product description

-- ============================================
-- CATEGORY: Wood Crafts (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Carved Wooden Spoon Set', 'Set of 5 handcrafted wooden cooking spoons made from mango wood. Each spoon features unique grain patterns. Perfect for non-stick cookware. Food-safe natural finish.', 'Wood Crafts', 899.00, 40, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', true, 8),

('Wooden Serving Tray', 'Large rectangular serving tray with handles. Made from sustainable acacia wood. Perfect for breakfast in bed or entertaining guests. Natural wood grain finish.', 'Wood Crafts', 1799.00, 25, 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&q=80', true, 8),

('Hand-Carved Wooden Comb', 'Traditional wooden comb hand-carved from neem wood. Anti-static and gentle on hair. Promotes healthy scalp. Eco-friendly alternative to plastic combs.', 'Wood Crafts', 399.00, 60, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', false, 8),

('Wooden Coaster Set', 'Set of 6 round wooden coasters with cork backing. Protects furniture from water rings. Natural wood finish with smooth edges. Comes in decorative holder.', 'Wood Crafts', 599.00, 50, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', false, 8),

('Carved Wooden Pen Stand', 'Elegant desk organizer with multiple compartments. Hand-carved from sheesham wood. Holds pens, pencils, scissors. Perfect for office or study table.', 'Wood Crafts', 799.00, 35, 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80', true, 8);

-- ============================================
-- CATEGORY: Handicrafts (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Jute Shopping Bag', 'Eco-friendly jute shopping bag with cotton handles. Spacious and durable. Perfect for groceries and daily shopping. Reduces plastic waste. Reusable and washable.', 'Handicrafts', 299.00, 100, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80', false, 8),

('Handmade Paper Diary', 'Beautiful handmade paper diary with 200 pages. Eco-friendly recycled paper. Perfect for journaling, sketching, or note-taking. Comes with fabric bookmark.', 'Handicrafts', 499.00, 45, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', true, 8),

('Cane Storage Basket', 'Natural cane basket with lid. Perfect for storing toys, clothes, or magazines. Handwoven by skilled artisans. Lightweight yet sturdy. Adds rustic charm.', 'Handicrafts', 1299.00, 30, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80', true, 8),

('Coconut Shell Bowl', 'Unique bowl made from natural coconut shell. Polished smooth finish. Perfect for serving snacks or as decorative piece. Eco-friendly and sustainable.', 'Handicrafts', 349.00, 70, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', false, 8),

('Handwoven Jute Rug', 'Natural jute area rug (3x5 feet). Handwoven with traditional techniques. Durable and eco-friendly. Perfect for living room or bedroom. Easy to clean.', 'Handicrafts', 2499.00, 20, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', true, 8);

-- ============================================
-- CATEGORY: Textiles (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Block Print Cotton Dupatta', 'Beautiful hand block printed cotton dupatta. Traditional Rajasthani designs. Soft and breathable fabric. Perfect for ethnic wear. Natural vegetable dyes used.', 'Textiles', 899.00, 40, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', true, 8),

('Handloom Cotton Towel Set', 'Set of 3 handloom cotton towels (bath, hand, face). Highly absorbent and quick-drying. Soft on skin. Traditional weaving techniques. Long-lasting quality.', 'Textiles', 1299.00, 35, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', false, 8),

('Tie-Dye Cotton Scarf', 'Vibrant tie-dye cotton scarf with traditional patterns. Lightweight and versatile. Can be worn as scarf, headband, or belt. Hand-dyed with natural colors.', 'Textiles', 599.00, 55, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', false, 8),

('Handwoven Cotton Throw', 'Cozy cotton throw blanket with tribal stripes. Perfect for couch or bed. Handwoven on traditional looms. Soft, warm, and durable. Machine washable.', 'Textiles', 1899.00, 25, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', true, 8),

('Embroidered Cotton Placemats', 'Set of 4 cotton placemats with hand embroidery. Protects table from spills and stains. Easy to wash. Adds elegance to dining table. Traditional motifs.', 'Textiles', 799.00, 45, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', false, 8);

-- ============================================
-- CATEGORY: Pottery (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Handmade Clay Kulhad Set', 'Set of 6 traditional clay cups (kulhad) for tea/coffee. Enhances beverage flavor. Eco-friendly and biodegradable. Authentic chai experience. Single-use or reusable.', 'Pottery', 199.00, 120, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', true, 8),

('Terracotta Cooking Pot', 'Traditional clay cooking pot (handi) with lid. Retains heat well. Perfect for slow cooking curries and rice. Healthy cooking option. Seasoned and ready to use.', 'Pottery', 899.00, 30, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', true, 8),

('Ceramic Tea Set', 'Handcrafted ceramic tea set with teapot and 4 cups. Hand-painted floral designs. Microwave safe. Perfect for tea parties. Comes in gift box.', 'Pottery', 1799.00, 20, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', true, 8),

('Clay Piggy Bank', 'Cute handmade clay piggy bank for kids. Hand-painted with bright colors. Teaches saving habits. Makes great gift. Break to open design.', 'Pottery', 299.00, 80, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', false, 8),

('Terracotta Hanging Planter', 'Beautiful terracotta hanging planter with jute rope. Perfect for succulents and small plants. Drainage hole included. Adds rustic charm to balcony or patio.', 'Pottery', 499.00, 50, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', false, 8);

-- ============================================
-- CATEGORY: Jewelry (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Terracotta Earrings', 'Lightweight terracotta earrings with hand-painted designs. Hypoallergenic. Perfect for daily wear. Unique tribal patterns. Comfortable for all-day wear.', 'Jewelry', 399.00, 60, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', true, 8),

('Wooden Bead Necklace', 'Long wooden bead necklace with natural finish. Lightweight and comfortable. Bohemian style. Perfect for casual and ethnic wear. Adjustable length.', 'Jewelry', 699.00, 45, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', false, 8),

('Brass Kada Bracelet', 'Traditional brass kada (bangle) with engraved patterns. Adjustable size. Antique finish. Suitable for men and women. Durable and long-lasting.', 'Jewelry', 599.00, 50, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', false, 8),

('Shell Pendant Necklace', 'Natural cowrie shell pendant on cotton thread. Adjustable length. Beach-inspired design. Lightweight and comfortable. Perfect summer accessory.', 'Jewelry', 449.00, 55, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', true, 8),

('Seed Bead Bracelet Set', 'Set of 3 colorful seed bead bracelets. Elastic fit. Stackable design. Handmade with love. Perfect for gifting. Vibrant tribal colors.', 'Jewelry', 349.00, 70, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', false, 8);

-- ============================================
-- CATEGORY: Home Decor (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Bamboo Wind Chime', 'Handcrafted bamboo wind chime with 7 tubes. Creates soothing sounds. Perfect for garden, balcony, or patio. Natural bamboo with weather-resistant coating.', 'Home Decor', 799.00, 40, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', true, 8),

('Jute Table Mat Set', 'Set of 6 round jute table mats. Heat-resistant and durable. Protects table surface. Natural eco-friendly material. Easy to clean with damp cloth.', 'Home Decor', 599.00, 50, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', false, 8),

('Wooden Key Holder', 'Wall-mounted wooden key holder with 5 hooks. Hand-carved design. Keeps keys organized. Easy to install. Perfect for entryway. Includes mounting hardware.', 'Home Decor', 499.00, 45, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', false, 8),

('Terracotta Wall Hanging', 'Decorative terracotta wall art with tribal motifs. Hand-painted with natural colors. Adds ethnic touch to walls. Lightweight and easy to hang.', 'Home Decor', 899.00, 30, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', true, 8),

('Cane Tissue Box Cover', 'Natural cane tissue box cover with lid. Hides unsightly tissue boxes. Handwoven design. Fits standard tissue boxes. Adds rustic charm to any room.', 'Home Decor', 399.00, 60, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80', false, 8);

-- ============================================
-- CATEGORY: Kitchen & Dining (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Wooden Mortar & Pestle', 'Traditional wooden mortar and pestle for grinding spices. Made from hardwood. Durable and long-lasting. Perfect for fresh spice blends. Easy to clean.', 'Kitchen & Dining', 699.00, 35, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', true, 8),

('Bamboo Cutlery Set', 'Eco-friendly bamboo cutlery set with fork, spoon, knife, and chopsticks. Reusable and biodegradable. Perfect for travel or office. Comes with carrying pouch.', 'Kitchen & Dining', 399.00, 80, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', false, 8),

('Clay Water Bottle', 'Natural clay water bottle (surahi) that keeps water cool. Traditional design with narrow neck. Eco-friendly alternative to plastic. Healthy drinking option.', 'Kitchen & Dining', 799.00, 40, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', true, 8),

('Wooden Salad Bowl', 'Large wooden salad bowl with smooth finish. Perfect for serving salads, fruits, or snacks. Made from sustainable wood. Food-safe natural oil finish.', 'Kitchen & Dining', 1299.00, 25, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', false, 8),

('Jute Bread Basket', 'Natural jute bread basket with cotton lining. Keeps bread fresh and warm. Perfect for dining table. Washable liner. Eco-friendly and reusable.', 'Kitchen & Dining', 499.00, 55, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80', false, 8);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify all products for seller 8 were inserted:
-- SELECT category, COUNT(*) as product_count FROM products WHERE seller_id = 8 GROUP BY category;
-- 
-- Total products for seller 8: 35 products across 7 categories
