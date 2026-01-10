-- Sample data for VanVyaapaar delivery system
USE vanvyaapaar;

-- Insert serviceable areas
INSERT IGNORE INTO serviceable_area (pincode, city, state, is_serviceable, standard_delivery_charge, standard_delivery_days, express_delivery_charge, express_delivery_days)
VALUES 
-- Maharashtra - Mumbai
('400001', 'Mumbai', 'Maharashtra', true, 50.0, 2, 100.0, 1),
('400002', 'Mumbai', 'Maharashtra', true, 50.0, 2, 100.0, 1),
('400051', 'Mumbai', 'Maharashtra', true, 50.0, 2, 100.0, 1),
('400067', 'Mumbai', 'Maharashtra', true, 50.0, 2, 100.0, 1),

-- Maharashtra - Pune
('411001', 'Pune', 'Maharashtra', true, 40.0, 2, 80.0, 1),
('411002', 'Pune', 'Maharashtra', true, 40.0, 2, 80.0, 1),
('411038', 'Pune', 'Maharashtra', true, 40.0, 2, 80.0, 1),
('411057', 'Pune', 'Maharashtra', true, 40.0, 2, 80.0, 1),

-- Maharashtra - Nagpur
('440001', 'Nagpur', 'Maharashtra', true, 45.0, 3, 90.0, 2),
('440008', 'Nagpur', 'Maharashtra', true, 45.0, 3, 90.0, 2),
('440022', 'Nagpur', 'Maharashtra', true, 45.0, 3, 90.0, 2),

-- Delhi
('110001', 'New Delhi', 'Delhi', true, 50.0, 2, 100.0, 1),
('110016', 'New Delhi', 'Delhi', true, 50.0, 2, 100.0, 1),
('110092', 'New Delhi', 'Delhi', true, 50.0, 2, 100.0, 1),

-- Karnataka - Bangalore
('560001', 'Bangalore', 'Karnataka', true, 45.0, 2, 90.0, 1),
('560034', 'Bangalore', 'Karnataka', true, 45.0, 2, 90.0, 1),
('560103', 'Bangalore', 'Karnataka', true, 45.0, 2, 90.0, 1);

-- Insert delivery agents
INSERT IGNORE INTO delivery_agent (name, phone, email, current_pincode, vehicle_type, vehicle_number, serviceable_pincodes, status, is_online, current_workload, total_deliveries, rating)
VALUES 
-- Mumbai Agents
('Rajesh Kumar', '9876543210', 'rajesh.kumar@vanvyapaar.com', '400001', 'BIKE', 'MH-01-AB-1234', '400001,400002,400051,400067', 'FREE', true, 0, 45, 4.7),
('Amit Sharma', '9876543211', 'amit.sharma@vanvyapaar.com', '400002', 'BIKE', 'MH-01-CD-5678', '400001,400002,400051,400067', 'FREE', true, 0, 38, 4.5),
('Suresh Patil', '9876543212', 'suresh.patil@vanvyapaar.com', '400051', 'SCOOTER', 'MH-01-EF-9012', '400001,400002,400051,400067', 'FREE', true, 0, 52, 4.8),

-- Pune Agents
('Vikram Desai', '9876543213', 'vikram.desai@vanvyapaar.com', '411001', 'BIKE', 'MH-12-GH-3456', '411001,411002,411038,411057', 'FREE', true, 0, 67, 4.9),
('Pradeep Joshi', '9876543214', 'pradeep.joshi@vanvyapaar.com', '411002', 'BIKE', 'MH-12-IJ-7890', '411001,411002,411038,411057', 'FREE', true, 0, 41, 4.6),

-- Nagpur Agents
('Ramesh Ingole', '9876543215', 'ramesh.ingole@vanvyapaar.com', '440001', 'BIKE', 'MH-31-KL-1234', '440001,440008,440022', 'FREE', true, 0, 29, 4.4),
('Santosh Bhosale', '9876543216', 'santosh.bhosale@vanvyapaar.com', '440008', 'SCOOTER', 'MH-31-MN-5678', '440001,440008,440022', 'FREE', true, 0, 33, 4.5),

-- Delhi Agents
('Rahul Singh', '9876543217', 'rahul.singh@vanvyapaar.com', '110001', 'BIKE', 'DL-01-OP-9012', '110001,110016,110092', 'FREE', true, 0, 58, 4.7),
('Manoj Verma', '9876543218', 'manoj.verma@vanvyapaar.com', '110016', 'BIKE', 'DL-01-QR-3456', '110001,110016,110092', 'FREE', true, 0, 44, 4.6),

-- Bangalore Agents
('Karthik Reddy', '9876543219', 'karthik.reddy@vanvyapaar.com', '560001', 'BIKE', 'KA-01-ST-7890', '560001,560034,560103', 'FREE', true, 0, 71, 4.9),
('Sunil Rao', '9876543220', 'sunil.rao@vanvyapaar.com', '560034', 'SCOOTER', 'KA-01-UV-1234', '560001,560034,560103', 'FREE', true, 0, 36, 4.5);

SELECT 'Sample data inserted successfully!' AS message,
       (SELECT COUNT(*) FROM serviceable_area) AS serviceable_areas_count,
       (SELECT COUNT(*) FROM delivery_agent) AS delivery_agents_count;