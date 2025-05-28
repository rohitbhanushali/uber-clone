#!/bin/bash

# Exit on error
set -e

# Load environment variables
source ../config/.env

# Get EC2 instance IDs from Terraform output
INSTANCE_IDS=$(aws ec2 describe-instances \
    --filters "Name=tag:Project,Values=uber-clone" "Name=tag:Environment,Values=dev" "Name=instance-state-name,Values=running" \
    --query 'Reservations[].Instances[].InstanceId' \
    --output text)

# Get ECR repository URI
ECR_REPO=$(aws ecr describe-repositories --repository-names uber-clone --query 'repositories[0].repositoryUri' --output text)

# Create deployment script
cat > deploy-app.sh << 'EOF'
#!/bin/bash
# Pull latest image
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${ECR_REPO}
docker pull ${ECR_REPO}:latest

# Stop and remove existing container
docker stop uber-clone || true
docker rm uber-clone || true

# Run new container
docker run -d \
    --name uber-clone \
    --restart unless-stopped \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e DB_HOST=${DB_HOST} \
    -e DB_PORT=${DB_PORT} \
    -e DB_USERNAME=${DB_USERNAME} \
    -e DB_PASSWORD=${DB_PASSWORD} \
    -e DB_NAME=${DB_NAME} \
    -e NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY} \
    -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN} \
    -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID} \
    -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET} \
    -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID} \
    -e NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID} \
    -e NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} \
    -e NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=${NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN} \
    -e NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    -e JWT_SECRET=${JWT_SECRET} \
    -e COOKIE_SECRET=${COOKIE_SECRET} \
    ${ECR_REPO}:latest
EOF

# Make the script executable
chmod +x deploy-app.sh

# Deploy to each EC2 instance
for INSTANCE_ID in $INSTANCE_IDS; do
    echo "Deploying to instance $INSTANCE_ID..."
    
    # Copy deployment script to instance
    aws ssm send-command \
        --instance-ids $INSTANCE_ID \
        --document-name "AWS-RunShellScript" \
        --parameters "commands=['$(cat deploy-app.sh | base64 -w 0)']" \
        --output text
done

echo "Deployment completed successfully" 