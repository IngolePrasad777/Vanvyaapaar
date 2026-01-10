# Single Dockerfile for VanVyaapaar - Frontend + Backend + MySQL
FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # Java 17 for Spring Boot
    openjdk-17-jdk \
    # Node.js 18 for React
    curl \
    # MySQL Server
    mysql-server \
    # Maven for building backend
    maven \
    # Nginx for serving frontend
    nginx \
    # Utilities
    wget \
    unzip \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV MAVEN_HOME=/usr/share/maven
ENV PATH=$PATH:$JAVA_HOME/bin:$MAVEN_HOME/bin

# MySQL Configuration
ENV MYSQL_ROOT_PASSWORD=prasad777
ENV MYSQL_DATABASE=vanvyaapaar
ENV MYSQL_USER=vanvyapaar_user
ENV MYSQL_PASSWORD=vanvyapaar_pass

# Configure MySQL
RUN service mysql start && \
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';" && \
    mysql -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};" && \
    mysql -e "CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';" && \
    mysql -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';" && \
    mysql -e "FLUSH PRIVILEGES;"

# Copy application files
COPY . /app/

# Build Backend
WORKDIR /app/vanpaayaar-backend
RUN mvn clean package -DskipTests

# Build Frontend
WORKDIR /app/vanvyapaar-frontend
RUN npm install && npm run build

# Configure Nginx
COPY <<EOF /etc/nginx/sites-available/default
server {
    listen 3000;
    server_name localhost;
    root /app/vanvyapaar-frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Create database initialization script
COPY <<EOF /app/init-db.sql
USE vanvyaapaar;

-- Create delivery system tables
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

-- Insert sample data
INSERT IGNORE INTO serviceable_area (pincode, city, state, is_serviceable, standard_delivery_charge, standard_delivery_days, express_delivery_charge, express_delivery_days)
VALUES 
('400001', 'Mumbai', 'Maharashtra', true, 50.0, 2, 100.0, 1),
('400002', 'Mumbai', 'Maharashtra', true, 50.0, 2, 100.0, 1),
('411001', 'Pune', 'Maharashtra', true, 40.0, 2, 80.0, 1),
('411002', 'Pune', 'Maharashtra', true, 40.0, 2, 80.0, 1),
('110001', 'New Delhi', 'Delhi', true, 50.0, 2, 100.0, 1),
('560001', 'Bangalore', 'Karnataka', true, 45.0, 2, 90.0, 1);

INSERT IGNORE INTO delivery_agent (name, phone, email, current_pincode, vehicle_type, vehicle_number, serviceable_pincodes, status, is_online, current_workload, total_deliveries, rating)
VALUES 
('Rajesh Kumar', '9876543210', 'rajesh.kumar@vanvyapaar.com', '400001', 'BIKE', 'MH-01-AB-1234', '400001,400002', 'FREE', true, 0, 45, 4.7),
('Vikram Desai', '9876543213', 'vikram.desai@vanvyapaar.com', '411001', 'BIKE', 'MH-12-GH-3456', '411001,411002', 'FREE', true, 0, 67, 4.9),
('Rahul Singh', '9876543217', 'rahul.singh@vanvyapaar.com', '110001', 'BIKE', 'DL-01-OP-9012', '110001', 'FREE', true, 0, 58, 4.7),
('Karthik Reddy', '9876543219', 'karthik.reddy@vanvyapaar.com', '560001', 'BIKE', 'KA-01-ST-7890', '560001', 'FREE', true, 0, 71, 4.9);
EOF

# Create supervisor configuration
COPY <<EOF /etc/supervisor/conf.d/vanvyapaar.conf
[supervisord]
nodaemon=true
user=root

[program:mysql]
command=/usr/bin/mysqld_safe
user=mysql
autorestart=true
priority=1

[program:backend]
command=java -jar /app/vanpaayaar-backend/target/vanvyaapaar-0.0.1-SNAPSHOT.jar
directory=/app/vanpaayaar-backend
user=root
autorestart=true
priority=2
environment=SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/vanvyaapaar?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",SPRING_DATASOURCE_USERNAME="vanvyapaar_user",SPRING_DATASOURCE_PASSWORD="vanvyapaar_pass"

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
user=root
autorestart=true
priority=3

[program:init-db]
command=/bin/bash -c "sleep 10 && mysql -u root -pprasad777 vanvyaapaar < /app/init-db.sql"
user=root
autorestart=false
priority=4
EOF

# Create startup script
COPY <<EOF /app/start.sh
#!/bin/bash

# Start MySQL
service mysql start

# Wait for MySQL to be ready
until mysqladmin ping -h localhost --silent; do
    echo 'Waiting for MySQL to be available...'
    sleep 2
done

# Initialize database
mysql -u root -p\${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS \${MYSQL_DATABASE};"
mysql -u root -p\${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '\${MYSQL_USER}'@'%' IDENTIFIED BY '\${MYSQL_PASSWORD}';"
mysql -u root -p\${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON \${MYSQL_DATABASE}.* TO '\${MYSQL_USER}'@'%';"
mysql -u root -p\${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"

# Run database initialization script
mysql -u root -p\${MYSQL_ROOT_PASSWORD} \${MYSQL_DATABASE} < /app/init-db.sql

# Start all services with supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/vanvyapaar.conf
EOF

RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8080 3306

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000 && curl -f http://localhost:8080/api/test/hello || exit 1

# Start all services
CMD ["/app/start.sh"]