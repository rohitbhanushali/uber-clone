#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting up environment variables for Uber Clone...${NC}\n"

# Check if .env file exists
if [ -f .env ]; then
    echo -e "${YELLOW}Warning: .env file already exists. Do you want to overwrite it? (y/n)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Setup cancelled.${NC}"
        exit 1
    fi
fi

# Get RDS endpoint from Terraform output
echo -e "${YELLOW}Getting RDS endpoint from Terraform...${NC}"
RDS_ENDPOINT=$(cd ../../terraform && terraform output -raw rds_endpoint)
if [ -z "$RDS_ENDPOINT" ]; then
    echo -e "${RED}Failed to get RDS endpoint. Make sure Terraform is initialized and applied.${NC}"
    exit 1
fi

# Get ALB DNS name from Terraform output
echo -e "${YELLOW}Getting ALB DNS name...${NC}"
APP_URL=$(cd ../../terraform && terraform output -raw app_url)
API_URL="${APP_URL}/api"

# Generate secure secrets
echo -e "${YELLOW}Generating secure secrets...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

# Prompt for Firebase configuration
echo -e "${YELLOW}Please enter your Firebase configuration:${NC}"
read -p "Firebase API Key: " FIREBASE_API_KEY
read -p "Firebase Auth Domain: " FIREBASE_AUTH_DOMAIN
read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase Storage Bucket: " FIREBASE_STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Firebase App ID: " FIREBASE_APP_ID
read -p "Firebase Measurement ID: " FIREBASE_MEASUREMENT_ID

# Prompt for Mapbox token
echo -e "${YELLOW}Please enter your Mapbox access token:${NC}"
read -p "Mapbox Access Token: " MAPBOX_ACCESS_TOKEN

# Prompt for AWS credentials
echo -e "${YELLOW}Please enter your AWS credentials:${NC}"
read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY

# Prompt for database password
echo -e "${YELLOW}Please enter your database password:${NC}"
read -sp "Database Password: " DB_PASSWORD
echo

# Create .env file
echo -e "${YELLOW}Creating .env file...${NC}"
cat > ../config/.env << EOL
# Environment
NODE_ENV=development

# Database Configuration
DB_HOST=${RDS_ENDPOINT}
DB_PORT=5432
DB_USERNAME=admin123
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=uber_clone

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
NEXT_PUBLIC_FIREBASE_APP_ID=${FIREBASE_APP_ID}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=${MAPBOX_ACCESS_TOKEN}

# Application Configuration
NEXT_PUBLIC_APP_URL=${APP_URL}
NEXT_PUBLIC_API_URL=${API_URL}

# Security
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}

# AWS Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
EOL

echo -e "${GREEN}Environment variables have been set up successfully!${NC}"
echo -e "${YELLOW}Make sure to add .env to your .gitignore file to keep your secrets secure.${NC}" 