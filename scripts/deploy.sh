#!/bin/bash

# Production Deployment Script
# Usage: ./scripts/deploy.sh [--force]

set -e  # Exit on any error

# Configuration
PROJECT_NAME="project-manager"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root (not recommended)
if [[ $EUID -eq 0 ]]; then
   log_warn "Running as root is not recommended. Consider using a non-root user with docker group access."
   read -p "Continue anyway? (y/N) " -n 1 -r
   echo
   if [[ ! $REPLY =~ ^[Yy]$ ]]; then
       exit 1
   fi
fi

# Check dependencies
command -v docker >/dev/null 2>&1 || { log_error "Docker is not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { log_error "docker-compose is not installed. Aborting."; exit 1; }

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    log_error "Production environment file $ENV_FILE not found!"
    log_info "Copy .env.production.example to $ENV_FILE and configure it."
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup current deployment (if exists)
if docker-compose -f "$COMPOSE_FILE" ps -q > /dev/null 2>&1; then
    log_info "Creating backup of current deployment..."
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
    
    # Create backup of volumes
    docker run --rm \
        -v prm_app-data:/data:ro \
        -v "$(pwd)/$BACKUP_DIR":/backup \
        alpine tar czf "/backup/volumes_$TIMESTAMP.tar.gz" -C /data .
    
    log_info "Backup created: volumes_$TIMESTAMP.tar.gz"
fi

# Pull latest images
log_info "Pulling latest Docker images..."
docker-compose -f "$COMPOSE_FILE" pull

# Health check function
health_check() {
    local max_attempts=30
    local wait_time=10
    local attempt=1
    
    log_info "Performing health checks..."
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt $attempt/$max_attempts"
        
        # Check if containers are running
        if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
            # Check nginx health endpoint
            if curl -f -s http://localhost/health > /dev/null 2>&1; then
                # Check frontend accessibility
                if curl -f -s http://localhost/prm/ > /dev/null 2>&1; then
                    log_info "✅ All health checks passed!"
                    return 0
                fi
            fi
        fi
        
        log_warn "Health check failed, waiting $wait_time seconds..."
        sleep $wait_time
        attempt=$((attempt + 1))
    done
    
    log_error "Health checks failed after $max_attempts attempts"
    return 1
}

# Deployment process
log_info "Starting deployment of $PROJECT_NAME..."

# Stop current containers gracefully
log_info "Stopping current containers..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# Start new deployment
log_info "Starting new deployment..."
docker-compose -f "$COMPOSE_FILE" up -d

# Wait for services to be ready
log_info "Waiting for services to start..."
sleep 20

# Perform health checks
if health_check; then
    log_info "🚀 Deployment completed successfully!"
    log_info "Application is available at: http://mt1607.xyz/prm"
    
    # Clean up old images
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    
else
    log_error "❌ Deployment failed health checks!"
    log_warn "Rolling back to previous version..."
    
    # Attempt rollback if backup exists
    docker-compose -f "$COMPOSE_FILE" down
    
    exit 1
fi

# Show running containers
log_info "Running containers:"
docker-compose -f "$COMPOSE_FILE" ps
