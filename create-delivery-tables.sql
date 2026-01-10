-- Create Delivery System Tables
-- Run this script to create the necessary database tables

-- ============================================
-- 1. Create Serviceable Areas Table
-- ============================================
CREATE TABLE IF NOT EXISTS serviceable_area (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pincode VARCHAR(10) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    is_serviceable BOOLEAN DEFAULT TRUE,
    standard_delivery_charge DECIMAL(10,2) DEFAULT 50.00,
    standard_delivery_days INT DEFAULT 3,
    express_delivery_charge DECIMAL(10,2) DEFAULT 100.00,
    express_delivery_days INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pincode (pincode),
    INDEX idx_city (city),
    INDEX idx_serviceable (is_serviceable)
);

-- ============================================
-- 2. Create Delivery Agents Table
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_agent (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    current_pincode VARCHAR(10) NOT NULL,
    vehicle_type ENUM('BIKE', 'SCOOTER', 'CAR', 'VAN') DEFAULT 'BIKE',
    vehicle_number VARCHAR(20) NOT NULL,
    serviceable_pincodes TEXT NOT NULL,
    status ENUM('FREE', 'ASSIGNED', 'BUSY', 'OFFLINE') DEFAULT 'FREE',
    is_online BOOLEAN DEFAULT FALSE,
    current_workload INT DEFAULT 0,
    total_deliveries INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_active_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_pincode (current_pincode),
    INDEX idx_status (status),
    INDEX idx_online (is_online),
    INDEX idx_rating (rating)
);

-- ============================================
-- 3. Create Deliveries Table
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    agent_id BIGINT NULL,
    tracking_id VARCHAR(50) UNIQUE,
    status ENUM('CREATED', 'ASSIGNED', 'ACCEPTED_BY_AGENT', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'CREATED',
    
    -- Address information
    pickup_address TEXT NOT NULL,
    pickup_pincode VARCHAR(10) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_pincode VARCHAR(10) NOT NULL,
    
    -- Contact information
    buyer_name VARCHAR(100),
    buyer_phone VARCHAR(15),
    seller_name VARCHAR(100),
    seller_phone VARCHAR(15),
    
    -- Timing information
    estimated_delivery_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Additional information
    agent_notes TEXT,
    attempt_count INT DEFAULT 0,
    
    -- Foreign key constraints
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES delivery_agent(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_order_id (order_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_tracking_id (tracking_id),
    INDEX idx_status (status),
    INDEX idx_pickup_pincode (pickup_pincode),
    INDEX idx_delivery_pincode (delivery_pincode),
    INDEX idx_created_at (created_at),
    INDEX idx_estimated_delivery (estimated_delivery_time)
);

-- ============================================
-- 4. Add Delivery Tracking ID Generation
-- ============================================
DELIMITER //
CREATE TRIGGER IF NOT EXISTS generate_tracking_id 
BEFORE INSERT ON deliveries
FOR EACH ROW
BEGIN
    IF NEW.tracking_id IS NULL THEN
        SET NEW.tracking_id = CONCAT('VV-DEL-', LPAD(NEW.id, 6, '0'));
    END IF;
END//
DELIMITER ;

-- ============================================
-- 5. Verify Tables Created
-- ============================================
SELECT 'Delivery system tables created successfully!' AS message,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'serviceable_area') AS serviceable_area_table,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'delivery_agent') AS delivery_agent_table,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'deliveries') AS deliveries_table;