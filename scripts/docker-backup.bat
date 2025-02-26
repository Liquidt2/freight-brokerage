@echo off
REM Script to backup PostgreSQL database in Docker environment for Windows

REM Check if docker-compose.prod.yml exists and use it, otherwise use docker-compose.yml
if exist docker-compose.prod.yml (
  set COMPOSE_FILE=docker-compose.prod.yml
) else (
  set COMPOSE_FILE=docker-compose.yml
)

echo Using compose file: %COMPOSE_FILE%

REM Check if the db container is running
docker-compose -f %COMPOSE_FILE% ps | findstr "db.*Up" > nul
if errorlevel 1 (
  echo Error: Database container is not running. Please start the containers first.
  echo Run: docker-compose -f %COMPOSE_FILE% up -d
  exit /b 1
)

REM Create backups directory if it doesn't exist
if not exist backups mkdir backups

REM Get current date and time for backup filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set dt=%%a
set YYYY=%dt:~0,4%
set MM=%dt:~4,2%
set DD=%dt:~6,2%
set HH=%dt:~8,2%
set MIN=%dt:~10,2%
set SS=%dt:~12,2%

set BACKUP_FILE=backups\freight_brokerage_%YYYY%-%MM%-%DD%_%HH%-%MIN%-%SS%.sql

echo Creating database backup to %BACKUP_FILE%...

REM Get database name, username and password from .env file if it exists
set DB_NAME=freight_brokerage
set DB_USER=postgres
set DB_PASS=postgres

if exist .env (
  for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="POSTGRES_DB" set DB_NAME=%%b
    if "%%a"=="POSTGRES_USER" set DB_USER=%%b
    if "%%a"=="POSTGRES_PASSWORD" set DB_PASS=%%b
  )
)

REM Run pg_dump to create backup
docker-compose -f %COMPOSE_FILE% exec db pg_dump -U %DB_USER% %DB_NAME% > %BACKUP_FILE%

if errorlevel 1 (
  echo Error: Database backup failed.
  exit /b 1
) else (
  echo Database backup completed successfully: %BACKUP_FILE%
)
