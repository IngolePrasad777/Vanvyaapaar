-- Sample Tribal Craft Products
-- Make sure you have at least one seller with ID 3 in your database
-- If not, adjust the seller_id values below

-- ============================================
-- CATEGORY: Wood Crafts (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Handcrafted Wooden Bowl', 'Beautiful hand-carved wooden bowl made from sustainable teak wood. Perfect for serving fruits or as decorative piece. Each piece is unique with natural wood grain patterns.', 'Wood Crafts', 1299.00, 25, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800', true, 3),

('Tribal Wooden Mask', 'Traditional tribal mask hand-carved by skilled artisans. Features intricate designs representing ancient tribal symbols. Made from premium hardwood with natural finish.', 'Wood Crafts', 2499.00, 15, 'https://images.unsplash.com/photo-1582747652673-603191169c49?w=800', true, 3),

('Wooden Jewelry Box', 'Elegant wooden jewelry box with hand-carved floral patterns. Features multiple compartments and velvet lining. Perfect gift for loved ones.', 'Wood Crafts', 1899.00, 30, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', false, 3),

('Decorative Wooden Elephant', 'Intricately carved wooden elephant statue. Symbol of wisdom and strength in tribal culture. Hand-painted with natural colors.', 'Wood Crafts', 1599.00, 20, 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800', false, 3),

('Wooden Wall Art Panel', 'Large decorative wall panel featuring traditional tribal motifs. Hand-carved from single piece of wood. Adds ethnic charm to any space.', 'Wood Crafts', 3499.00, 10, 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800', true, 3);

-- ============================================
-- CATEGORY: Handicrafts (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Bamboo Basket Set', 'Set of 3 handwoven bamboo baskets in different sizes. Eco-friendly and durable. Perfect for storage or home decoration. Made using traditional weaving techniques.', 'Handicrafts', 899.00, 40, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800', true, 3),

('Tribal Dream Catcher', 'Authentic handmade dream catcher with feathers and beads. Based on traditional tribal designs. Brings positive energy and peaceful sleep.', 'Handicrafts', 699.00, 50, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', false, 3),

('Handwoven Wall Hanging', 'Beautiful macrame wall hanging with tribal patterns. Made from natural cotton threads. Adds bohemian touch to your home decor.', 'Handicrafts', 1299.00, 35, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800', true, 3),

('Tribal Wind Chimes', 'Melodious wind chimes made from bamboo and shells. Hand-painted with traditional designs. Creates soothing sounds in the breeze.', 'Handicrafts', 799.00, 45, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', false, 3),

('Decorative Tribal Lamp', 'Unique table lamp with tribal-inspired shade. Hand-painted with natural dyes. Creates warm ambient lighting.', 'Handicrafts', 1999.00, 20, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800', true, 3);

-- ============================================
-- CATEGORY: Textiles (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Handloom Cotton Saree', 'Traditional handloom cotton saree with tribal border designs. Soft, breathable fabric perfect for daily wear. Natural dyes used for coloring.', 'Textiles', 2499.00, 25, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', true, 3),

('Tribal Print Cushion Covers', 'Set of 4 cushion covers with authentic tribal prints. Made from premium cotton fabric. Adds ethnic touch to your living space.', 'Textiles', 899.00, 60, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', false, 3),

('Handwoven Table Runner', 'Beautiful handwoven table runner with geometric tribal patterns. Made from natural cotton and jute blend. Perfect for dining table decoration.', 'Textiles', 699.00, 40, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', false, 3),

('Tribal Embroidered Stole', 'Elegant stole with hand-embroidered tribal motifs. Soft wool blend fabric. Perfect accessory for traditional and modern outfits.', 'Textiles', 1599.00, 30, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', true, 3),

('Handloom Bedsheet Set', 'Premium handloom bedsheet set with tribal border designs. Includes 1 bedsheet and 2 pillow covers. 100% cotton, soft and durable.', 'Textiles', 2999.00, 20, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', true, 3);

-- ============================================
-- CATEGORY: Pottery (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Terracotta Planter Set', 'Set of 3 handmade terracotta planters with tribal designs. Perfect for indoor plants. Natural clay with hand-painted patterns.', 'Pottery', 799.00, 35, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800', false, 3),

('Clay Water Pot', 'Traditional clay water pot (matka) that keeps water naturally cool. Hand-crafted using ancient pottery techniques. Eco-friendly and healthy.', 'Pottery', 599.00, 50, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800', true, 3),

('Decorative Ceramic Vase', 'Beautiful ceramic vase with hand-painted tribal motifs. Perfect for flowers or as standalone decorative piece. Glazed finish.', 'Pottery', 1299.00, 25, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800', true, 3),

('Tribal Clay Diya Set', 'Set of 10 handmade clay diyas (oil lamps) with traditional designs. Perfect for festivals and celebrations. Hand-painted with natural colors.', 'Pottery', 399.00, 100, 'https://images.unsplash.com/photo-1609619385002-f40f1df9b9f3?w=800', false, 3),

('Ceramic Dinner Plate Set', 'Set of 6 ceramic dinner plates with tribal border designs. Microwave and dishwasher safe. Adds ethnic charm to your dining experience.', 'Pottery', 2499.00, 20, 'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f6?w=800', false, 3);

-- ============================================
-- CATEGORY: Jewelry (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Tribal Silver Necklace', 'Authentic tribal silver necklace with traditional pendant. Handcrafted by skilled artisans. Features intricate filigree work.', 'Jewelry', 3499.00, 15, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', true, 3),

('Beaded Tribal Bracelet', 'Colorful beaded bracelet with traditional tribal patterns. Made from natural beads and threads. Adjustable size.', 'Jewelry', 499.00, 80, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', false, 3),

('Oxidized Jhumka Earrings', 'Traditional oxidized silver jhumka earrings with tribal designs. Lightweight and comfortable. Perfect for ethnic wear.', 'Jewelry', 899.00, 50, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', true, 3),

('Tribal Anklet Pair', 'Beautiful pair of tribal anklets with bells. Made from German silver with antique finish. Creates melodious sound while walking.', 'Jewelry', 1299.00, 30, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', false, 3),

('Handcrafted Nose Ring', 'Delicate tribal nose ring with traditional design. Made from pure silver. Comfortable and elegant.', 'Jewelry', 699.00, 40, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', false, 3);

-- ============================================
-- CATEGORY: Home Decor (5 products)
-- ============================================

INSERT INTO products (name, description, category, price, stock, image_url, featured, seller_id) VALUES
('Tribal Wall Mirror', 'Decorative wall mirror with hand-carved wooden frame featuring tribal motifs. Adds ethnic elegance to any room.', 'Home Decor', 2299.00, 20, 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', true, 3),

('Brass Tribal Statue', 'Handcrafted brass statue depicting tribal deity. Traditional design with antique finish. Perfect for home temple or decoration.', 'Home Decor', 1899.00, 25, 'https://images.unsplash.com/photo-1582747652673-603191169c49?w=800', false, 3),

('Tribal Door Hanging', 'Colorful door hanging (toran) with beads and mirrors. Traditional tribal design. Brings positive energy to your home entrance.', 'Home Decor', 599.00, 60, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', false, 3),

('Wooden Photo Frame Set', 'Set of 3 wooden photo frames with hand-carved tribal patterns. Natural wood finish. Perfect for displaying family memories.', 'Home Decor', 1499.00, 35, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', true, 3),

('Tribal Incense Holder', 'Beautiful brass incense holder with tribal engravings. Comes with wooden base. Perfect for meditation and prayer.', 'Home Decor', 799.00, 45, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800', false, 3);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify all products were inserted:
-- SELECT category, COUNT(*) as product_count FROM products GROUP BY category;
