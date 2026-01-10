-- VanVyaapaar Database Initialization
-- This script will run when the MySQL container starts for the first time

USE vanvyaapaar;

-- Create delivery system tables if they don't exist
-- (The main application tables will be created by Hibernate)

-- Serviceable Areas Table
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

-- Delivery Agents Table
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

-- Note: The deliveries table will be created by Hibernate as it references other entities
-- that need to be created first by the application

SELECT 'Database initialization completed!' AS message;