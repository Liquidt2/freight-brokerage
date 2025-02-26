@echo off
REM Script to run Prisma migrations in Docker environment for Windows

REM Check if docker-compose.prod.yml exists and use it, otherwise use docker-compose.yml
if exist docker-compose.prod.yml (
  set COMPOSE_FILE=docker-compose.prod.yml
) else (
  set COMPOSE_FILE=docker-compose.yml
)

echo Using compose file: %COMPOSE_FILE%

REM Check if the web container is running
docker-compose -f %COMPOSE_FILE% ps | findstr "web.*Up" > nul
if errorlevel 1 (
  echo Error: Web container is not running. Please start the containers first.
  echo Run: docker-compose -f %COMPOSE_FILE% up -d
  exit /b 1
)

echo Running Prisma migrations...
docker-compose -f %COMPOSE_FILE% exec web npx prisma migrate deploy

if errorlevel 1 (
  echo Error: Migrations failed.
  exit /b 1
) else (
  echo Migrations completed successfully.
)

echo Generating Prisma client...
docker-compose -f %COMPOSE_FILE% exec web npx prisma generate

if errorlevel 1 (
  echo Error: Prisma client generation failed.
  exit /b 1
) else (
  echo Prisma client generated successfully.
)

echo Database setup completed.
