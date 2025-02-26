#!/bin/bash

# Script to backup PostgreSQL database in Docker environment

# Check if docker-compose.prod.yml exists and use it, otherwise use docker-compose.yml
if [ -f "docker-compose.prod.yml" ]; then
  COMPOSE_FILE="docker-compose.prod.yml"
else
  COMPOSE_FILE="docker-compose.yml"
fi

echo "Using compose file: $COMPOSE_FILE"

# Check if the db container is running
if ! docker-compose -f $COMPOSE_FILE ps | grep -q "db.*Up"; then
  echo "Error: Database container is not running. Please start the containers first."
  echo "Run: docker-compose -f $COMPOSE_FILE up -d"
  exit 1
fi

# Create backups directory if it doesn't exist
mkdir -p backups

# Get current date and time for backup filename
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="backups/freight_brokerage_$TIMESTAMP.sql"

echo "Creating database backup to $BACKUP_FILE..."

# Get database name, username and password from .env file if it exists
DB_NAME="freight_brokerage"
DB_USER="postgres"
DB_PASS="postgres"

if [ -f ".env" ]; then
  source <(grep -E "^(POSTGRES_DB|POSTGRES_USER|POSTGRES_PASSWORD)=" .env)
  [ ! -z "$POSTGRES_DB" ] && DB_NAME=$POSTGRES_DB
  [ ! -z "$POSTGRES_USER" ] && DB_USER=$POSTGRES_USER
  [ ! -z "$POSTGRES_PASSWORD" ] && DB_PASS=$POSTGRES_PASSWORD
fi

# Run pg_dump to create backup
docker-compose -f $COMPOSE_FILE exec db pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "Database backup completed successfully: $BACKUP_FILE"
else
  echo "Error: Database backup failed."
  exit 1
fi
