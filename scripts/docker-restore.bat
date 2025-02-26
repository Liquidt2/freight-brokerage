@echo off
REM Script to restore PostgreSQL database in Docker environment for Windows

if "%~1"=="" (
  echo Error: Please provide the backup file path.
  echo Usage: docker-restore.bat path\to\backup.sql
  exit /b 1
)

set BACKUP_FILE=%~1

if not exist "%BACKUP_FILE%" (
  echo Error: Backup file not found: %BACKUP_FILE%
  exit /b 1
)

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

echo Restoring database from backup: %BACKUP_FILE%...

REM Confirm before proceeding
set /p CONFIRM=This will overwrite the current database. Are you sure? (Y/N): 
if /i not "%CONFIRM%"=="Y" (
  echo Restore cancelled.
  exit /b 0
)

REM Run psql to restore backup
type "%BACKUP_FILE%" | docker-compose -f %COMPOSE_FILE% exec -T db psql -U %DB_USER% %DB_NAME%

if errorlevel 1 (
  echo Error: Database restore failed.
  exit /b 1
) else (
  echo Database restore completed successfully.
)

REM Run migrations to ensure schema is up to date
echo Running migrations to ensure schema is up to date...
call scripts\docker-migrate.bat

if errorlevel 1 (
  echo Warning: Migrations failed after restore.
  exit /b 1
) else (
  echo Restore and migrations completed successfully.
)
