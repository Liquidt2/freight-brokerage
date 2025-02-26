# Docker Deployment Guide

This guide provides instructions for deploying the Freight Brokerage application on a VPS server using Docker.

## Prerequisites

- A VPS server with Docker and Docker Compose installed
- Domain name (optional, but recommended for production)
- SSL certificates (for HTTPS)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd freight-brokerage
```

### 2. Configure Environment Variables

Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and fill in your actual values:

```
# PostgreSQL Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=freight_brokerage

# Email Configuration
SMTP_HOST=smtp.example.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
NEXT_PUBLIC_SANITY_API_TOKEN=your_sanity_api_token
SANITY_STUDIO_TOKEN=your_sanity_studio_token
```

### 3. SSL Certificates (for Production)

For production deployment with HTTPS:

1. Create the SSL directory:

```bash
mkdir -p nginx/ssl
```

2. Place your SSL certificates in the `nginx/ssl` directory:
   - `cert.pem` - Your SSL certificate
   - `key.pem` - Your private key

If you're using Let's Encrypt, you can generate certificates using certbot.

### 4. Development Deployment

For development or testing, use the standard docker-compose file:

```bash
docker-compose up -d
```

This will:
- Build the Next.js application
- Start a PostgreSQL database
- Expose the application on port 3000

### 5. Deployment

You can use the provided deployment scripts for a streamlined deployment process:

**Windows:**
```bash
# For development deployment
scripts\deploy.bat

# For production deployment
scripts\deploy.bat prod
```

**Linux/Mac:**
```bash
# For development deployment
./scripts/deploy.sh

# For production deployment
./scripts/deploy.sh prod
```

These scripts will:
- Check for required files and configurations
- Pull the latest changes from git (if in a git repository)
- Create necessary directories
- Build and start the containers
- Run database migrations
- Show the deployment status

Alternatively, you can manually deploy:

**Development:**
```bash
docker-compose up -d
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

The production deployment will:
- Build the Next.js application
- Start a PostgreSQL database
- Set up Nginx as a reverse proxy with SSL
- Expose the application on ports 80 (HTTP) and 443 (HTTPS)

### 6. Database Migrations

To run Prisma migrations, you can use the provided utility script:

**Windows:**
```bash
scripts\docker-migrate.bat
```

**Linux/Mac:**
```bash
./scripts/docker-migrate.sh
```

Or manually:
```bash
docker-compose exec web npx prisma migrate deploy
```

### 7. Monitoring and Logs

View logs for the web application:

```bash
docker-compose logs -f web
```

View logs for the database:

```bash
docker-compose logs -f db
```

### 8. Updating the Application

To update the application:

```bash
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Database Connection Issues

If the application cannot connect to the database:

1. Check that the database container is running:
   ```bash
   docker-compose ps
   ```

2. Verify the database credentials in the `.env` file

3. Check the database logs:
   ```bash
   docker-compose logs db
   ```

### Web Server Issues

If the web server is not responding:

1. Check the web container logs:
   ```bash
   docker-compose logs web
   ```

2. Verify that the container is healthy:
   ```bash
   docker-compose ps
   ```

3. Check if the application is running inside the container:
   ```bash
   docker-compose exec web ps aux
   ```

## Backup and Restore

### Database Backup

You can use the provided utility script for database backups:

**Windows:**
```bash
scripts\docker-backup.bat
```

**Linux/Mac:**
```bash
./scripts/docker-backup.sh
```

This will create a timestamped backup file in the `backups` directory.

Or manually:
```bash
docker-compose exec db pg_dump -U postgres freight_brokerage > backup.sql
```

### Database Restore

You can use the provided utility script to restore from a backup:

**Windows:**
```bash
scripts\docker-restore.bat path\to\backup.sql
```

**Linux/Mac:**
```bash
./scripts/docker-restore.sh path/to/backup.sql
```

Or manually:
```bash
cat backup.sql | docker-compose exec -T db psql -U postgres freight_brokerage
```

## Security Considerations

1. Always use strong passwords for the database and other services
2. Keep your Docker and host system updated with security patches
3. Consider using a firewall to restrict access to your server
4. Set up regular backups of your database and application data
5. Monitor your server for unusual activity
