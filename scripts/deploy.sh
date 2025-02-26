#!/bin/bash

# Script to deploy the application on a VPS server

# Check if we're in production mode
if [ "$1" == "prod" ] || [ "$1" == "production" ]; then
  COMPOSE_FILE="docker-compose.prod.yml"
  echo "Deploying in PRODUCTION mode using $COMPOSE_FILE"
else
  COMPOSE_FILE="docker-compose.yml"
  echo "Deploying in DEVELOPMENT mode using $COMPOSE_FILE"
  echo "Use './scripts/deploy.sh prod' for production deployment"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Error: .env file not found. Please create it first."
  echo "You can copy .env.example and fill in your values:"
  echo "cp .env.example .env"
  exit 1
fi

# Pull latest changes if in a git repository
if [ -d ".git" ]; then
  echo "Pulling latest changes from git repository..."
  git pull
  if [ $? -ne 0 ]; then
    echo "Warning: Failed to pull latest changes. Continuing with deployment..."
  fi
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p backups

# Check if SSL certificates exist for production
if [ "$COMPOSE_FILE" == "docker-compose.prod.yml" ]; then
  if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    echo "Warning: SSL certificates not found in nginx/ssl/"
    echo "You need to place your SSL certificates as:"
    echo "  - nginx/ssl/cert.pem (certificate)"
    echo "  - nginx/ssl/key.pem (private key)"
    read -p "Continue without SSL certificates? (y/N): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
      echo "Deployment cancelled."
      exit 0
    fi
  fi
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose -f $COMPOSE_FILE build
if [ $? -ne 0 ]; then
  echo "Error: Failed to build containers."
  exit 1
fi

docker-compose -f $COMPOSE_FILE up -d
if [ $? -ne 0 ]; then
  echo "Error: Failed to start containers."
  exit 1
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "Running database migrations..."
./scripts/docker-migrate.sh
if [ $? -ne 0 ]; then
  echo "Warning: Database migrations failed."
fi

echo "Deployment completed successfully!"
echo "Your application should now be running at:"
if [ "$COMPOSE_FILE" == "docker-compose.prod.yml" ]; then
  echo "  - https://your-domain.com (with SSL)"
  echo "  - http://your-domain.com (redirects to HTTPS)"
else
  echo "  - http://your-server-ip:3000"
fi

# Show container status
echo -e "\nContainer status:"
docker-compose -f $COMPOSE_FILE ps
