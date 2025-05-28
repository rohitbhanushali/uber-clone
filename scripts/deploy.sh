#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Validate required environment variables
required_vars=(
    "DB_HOST"
    "DB_PORT"
    "DB_USERNAME"
    "DB_PASSWORD"
    "DB_NAME"
    "NEXT_PUBLIC_APP_URL"
    "NEXT_PUBLIC_API_URL"
    "JWT_SECRET"
    "COOKIE_SECRET"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set"
        exit 1
    fi
done

# Build Docker image
echo "Building Docker image..."
docker build -t uber-clone .

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com

# Tag and push image
echo "Tagging and pushing image to ECR..."
docker tag uber-clone:latest $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/uber-clone:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/uber-clone:latest

# Run database migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate

# Run database seeds
echo "Running database seeds..."
npx sequelize-cli db:seed:all

echo "Deployment completed successfully!" 