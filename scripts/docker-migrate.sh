#!/bin/bash

# Script to run Prisma migrations in Docker environment

# Check if docker-compose.prod.yml exists and use it, otherwise use docker-compose.yml
if [ -f "docker-compose.prod.yml" ]; then
  COMPOSE_FILE="docker-compose.prod.yml"
else
  COMPOSE_FILE="docker-compose.yml"
fi

echo "Using compose file: $COMPOSE_FILE"

# Check if the web container is running
if ! docker-compose -f $COMPOSE_FILE ps | grep -q "web.*Up"; then
  echo "Error: Web container is not running. Please start the containers first."
  echo "Run: docker-compose -f $COMPOSE_FILE up -d"
  exit 1
fi

echo "Running Prisma migrations..."
docker-compose -f $COMPOSE_FILE exec web npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "Migrations completed successfully."
else
  echo "Error: Migrations failed."
  exit 1
fi

echo "Generating Prisma client..."
docker-compose -f $COMPOSE_FILE exec web npx prisma generate

if [ $? -eq 0 ]; then
  echo "Prisma client generated successfully."
else
  echo "Error: Prisma client generation failed."
  exit 1
fi

echo "Database setup completed."
