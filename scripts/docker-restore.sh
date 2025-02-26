#!/bin/bash

# Script to restore PostgreSQL database in Docker environment

if [ -z "$1" ]; then
  echo "Error: Please provide the backup file path."
  echo "Usage: ./docker-restore.sh path/to/backup.sql"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

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

echo "Restoring database from backup: $BACKUP_FILE..."

# Confirm before proceeding
read -p "This will overwrite the current database. Are you sure? (y/N): " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 0
fi

# Run psql to restore backup
cat "$BACKUP_FILE" | docker-compose -f $COMPOSE_FILE exec -T db psql -U $DB_USER $DB_NAME

if [ $? -eq 0 ]; then
  echo "Database restore completed successfully."
else
  echo "Error: Database restore failed."
  exit 1
fi

# Run migrations to ensure schema is up to date
echo "Running migrations to ensure schema is up to date..."
./scripts/docker-migrate.sh

if [ $? -eq 0 ]; then
  echo "Restore and migrations completed successfully."
else
  echo "Warning: Migrations failed after restore."
  exit 1
fi
