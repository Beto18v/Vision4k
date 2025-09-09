#!/bin/bash

# Vision4K Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_PATH=$(pwd)

echo "🚀 Starting Vision4K deployment to $ENVIRONMENT..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    print_error "This script must be run from the Laravel project root directory"
    exit 1
fi

# Backup current deployment
print_status "Creating backup..."
if [ -d "current_backup" ]; then
    rm -rf current_backup
fi
cp -r . current_backup 2>/dev/null || true

# Install/update dependencies
print_status "Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev --quiet

print_status "Installing Node.js dependencies..."
npm ci --silent
npm run build --silent

# Environment setup
print_status "Setting up environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Please configure your .env file with production values"
fi

# Generate application key if not exists
if ! grep -q "APP_KEY=base64:" .env; then
    print_status "Generating application key..."
    php artisan key:generate
fi

# Database operations
print_status "Running database migrations..."
php artisan migrate --force

# Clear and cache configuration
print_status "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update SSL certificates
print_status "Updating SSL certificates..."
php artisan ssl:update-certificates

# Set proper permissions
print_status "Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Optional: Run tests
if [ "$ENVIRONMENT" = "staging" ]; then
    print_status "Running tests..."
    php artisan test
fi

# Clear all caches one final time
print_status "Final cache clear..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Health check
print_status "Running health check..."
if php artisan route:list | grep -q "auth/google"; then
    print_status "✅ Google OAuth routes are properly configured"
else
    print_error "❌ Google OAuth routes not found"
    exit 1
fi

if [ -f "storage/ssl/cacert.pem" ]; then
    print_status "✅ SSL certificates are updated"
else
    print_warning "⚠️  SSL certificates not found, run: php artisan ssl:update-certificates"
fi

print_status "🎉 Deployment completed successfully!"
print_status ""
print_status "Next steps:"
print_status "1. Configure your web server (Apache/Nginx)"
print_status "2. Set up SSL certificate for your domain"
print_status "3. Configure Google OAuth credentials in Google Console"
print_status "4. Test the application: https://yourdomain.com"
print_status "5. Set up monitoring and log rotation"
print_status ""
print_status "Useful commands:"
print_status "- View logs: tail -f storage/logs/laravel.log"
print_status "- Clear cache: php artisan cache:clear"
print_status "- Update SSL: php artisan ssl:update-certificates"
print_status "- Check routes: php artisan route:list | grep google"
