@echo off
REM Script to deploy the application on a VPS server for Windows

REM Check if we're in production mode
if "%1"=="prod" (
  set COMPOSE_FILE=docker-compose.prod.yml
  echo Deploying in PRODUCTION mode using %COMPOSE_FILE%
) else if "%1"=="production" (
  set COMPOSE_FILE=docker-compose.prod.yml
  echo Deploying in PRODUCTION mode using %COMPOSE_FILE%
) else (
  set COMPOSE_FILE=docker-compose.yml
  echo Deploying in DEVELOPMENT mode using %COMPOSE_FILE%
  echo Use 'scripts\deploy.bat prod' for production deployment
)

REM Check if .env file exists
if not exist .env (
  echo Error: .env file not found. Please create it first.
  echo You can copy .env.example and fill in your values:
  echo copy .env.example .env
  exit /b 1
)

REM Pull latest changes if in a git repository
if exist .git (
  echo Pulling latest changes from git repository...
  git pull
  if errorlevel 1 (
    echo Warning: Failed to pull latest changes. Continuing with deployment...
  )
)

REM Create necessary directories
echo Creating necessary directories...
if not exist nginx\ssl mkdir nginx\ssl
if not exist backups mkdir backups

REM Check if SSL certificates exist for production
if "%COMPOSE_FILE%"=="docker-compose.prod.yml" (
  if not exist nginx\ssl\cert.pem (
    echo Warning: SSL certificate not found in nginx\ssl\
    echo You need to place your SSL certificates as:
    echo   - nginx\ssl\cert.pem (certificate)
    echo   - nginx\ssl\key.pem (private key)
    set /p CONTINUE=Continue without SSL certificates? (y/N): 
    if /i not "%CONTINUE%"=="y" (
      echo Deployment cancelled.
      exit /b 0
    )
  )
)

REM Build and start the containers
echo Building and starting containers...
docker-compose -f %COMPOSE_FILE% build
if errorlevel 1 (
  echo Error: Failed to build containers.
  exit /b 1
)

docker-compose -f %COMPOSE_FILE% up -d
if errorlevel 1 (
  echo Error: Failed to start containers.
  exit /b 1
)

REM Wait for database to be ready
echo Waiting for database to be ready...
timeout /t 10 /nobreak > nul

REM Run database migrations
echo Running database migrations...
call scripts\docker-migrate.bat
if errorlevel 1 (
  echo Warning: Database migrations failed.
)

echo Deployment completed successfully!
echo Your application should now be running at:
if "%COMPOSE_FILE%"=="docker-compose.prod.yml" (
  echo   - https://your-domain.com (with SSL)
  echo   - http://your-domain.com (redirects to HTTPS)
) else (
  echo   - http://your-server-ip:3000
)

REM Show container status
echo.
echo Container status:
docker-compose -f %COMPOSE_FILE% ps
