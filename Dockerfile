# Simplified Dockerfile for VanVyaapaar Application
FROM node:18-alpine AS frontend-build

# Build Frontend
WORKDIR /app/frontend
COPY vanvyapaar-frontend/ ./
RUN npm install --legacy-peer-deps && npm run build -- --mode production || npm run build

# Backend Build Stage  
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build

WORKDIR /app/backend
COPY vanpaayaar-backend/ ./
RUN mvn clean package -DskipTests

# Final Runtime Stage
FROM eclipse-temurin:17-jre-alpine

# Install required packages
RUN apk add --no-cache nginx supervisor mysql mysql-client bash curl

# Create application directory
WORKDIR /app

# Copy built artifacts
COPY --from=backend-build /app/backend/target/*.jar ./vanvyaapaar-backend.jar
COPY --from=frontend-build /app/frontend/dist ./frontend-dist

# Configure Nginx
RUN mkdir -p /etc/nginx/conf.d && \
    echo 'server { \
        listen 3000; \
        root /app/frontend-dist; \
        index index.html; \
        location / { try_files $uri $uri/ /index.html; } \
        location /api/ { \
            proxy_pass http://localhost:8080; \
            proxy_set_header Host $host; \
        } \
    }' > /etc/nginx/conf.d/default.conf

# Configure MySQL and Supervisor
RUN mkdir -p /var/lib/mysql /var/run/mysqld /var/log/mysql /var/log/supervisor /etc/supervisor/conf.d && \
    chown -R mysql:mysql /var/lib/mysql /var/run/mysqld /var/log/mysql && \
    mysql_install_db --user=mysql --datadir=/var/lib/mysql

# Create supervisor config
RUN echo '[supervisord] \
nodaemon=true \
[program:mysql] \
command=/usr/bin/mysqld_safe --datadir=/var/lib/mysql --user=mysql \
autostart=true \
autorestart=true \
user=mysql \
priority=1 \
[program:backend] \
command=java -jar /app/vanvyaapaar-backend.jar \
directory=/app \
autostart=true \
autorestart=true \
user=root \
priority=2 \
environment=SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/vanvyaapaar?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",SPRING_DATASOURCE_USERNAME="vanvyaapaar_user",SPRING_DATASOURCE_PASSWORD="vanvyaapaar_pass",SPRING_JPA_HIBERNATE_DDL_AUTO="update" \
[program:nginx] \
command=/usr/sbin/nginx -g "daemon off;" \
autostart=true \
autorestart=true \
user=root \
priority=3' > /etc/supervisor/conf.d/supervisord.conf

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "Starting VanVyaapaar..."' >> /app/start.sh && \
    echo 'mysqld_safe --datadir=/var/lib/mysql --user=mysql &' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo 'mysql -e "CREATE DATABASE IF NOT EXISTS vanvyaapaar;"' >> /app/start.sh && \
    echo 'mysql -e "CREATE USER IF NOT EXISTS '"'"'vanvyaapaar_user'"'"'@'"'"'%'"'"' IDENTIFIED BY '"'"'vanvyaapaar_pass'"'"';"' >> /app/start.sh && \
    echo 'mysql -e "GRANT ALL PRIVILEGES ON vanvyaapaar.* TO '"'"'vanvyaapaar_user'"'"'@'"'"'%'"'"';"' >> /app/start.sh && \
    echo 'mysql -e "FLUSH PRIVILEGES;"' >> /app/start.sh && \
    echo 'mysqladmin shutdown' >> /app/start.sh && \
    echo 'exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8080 3306

# Start the application
CMD ["/app/start.sh"]