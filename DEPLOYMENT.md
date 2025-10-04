# Project Manager - Deployment Guide

This guide covers the CI/CD setup and deployment process for the Project Manager application.

## Architecture Overview

The application consists of:
- **Frontend**: React app with React Router (served at `mt1607.xyz/prm`)
- **Backend**: Node.js/Express API (proxied at `mt1607.xyz/prm/api`)
- **Nginx**: Reverse proxy and static file server
- **Docker**: Containerization for all services

## Prerequisites

### Development
- Node.js 20+
- Docker & Docker Compose
- Git

### Production Server
- Linux server with Docker installed
- Domain name pointing to the server (`mt1607.xyz`)
- SSH access to the server

## Environment Setup

1. **Copy environment files:**
   ```bash
   cp .env.production.example .env.production
   ```

2. **Configure production environment:**
   Edit `.env.production` with your actual values:
   ```bash
   # Database
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prm-production
   
   # Security
   JWT_SECRET=your-secure-jwt-secret
   
   # Email (optional)
   RESEND_API_KEY=your-resend-api-key
   ```

## Local Development

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Development
```bash
# Backend
cd back-end
npm install
npm start

# Frontend (in another terminal)
cd front-end/fe-project-manager
npm install
npm run dev
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles:

1. **Testing**: Runs tests and linting on push/PR
2. **Building**: Creates Docker images and pushes to GitHub Container Registry
3. **Deployment**: Deploys to production server via SSH

### Required GitHub Secrets

Set these in your GitHub repository settings:

```
DEPLOY_SSH_KEY=<private-ssh-key-for-server>
SERVER_HOST=<your-server-ip-or-domain>
SERVER_USER=<ssh-username>
DEPLOY_PATH=<path-to-project-on-server>
```

### Workflow Triggers

- **Push to `main`**: Full CI/CD pipeline with deployment
- **Push to `develop`**: CI only (testing and building)
- **Pull Requests**: CI only
- **Manual**: Via GitHub Actions UI

## Production Deployment

### Option 1: Automatic (Recommended)
Push to main branch to trigger automatic deployment:
```bash
git push origin main
```

### Option 2: Manual Deployment
On your production server:

```bash
# Clone repository
git clone https://github.com/your-username/project-manager.git
cd project-manager

# Setup environment
cp .env.production.example .env.production
# Edit .env.production with your values

# Deploy using script
./scripts/deploy.sh
```

### Option 3: Docker Compose Only
```bash
# Pull and start services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## Monitoring and Maintenance

### Health Checks
- Application: `https://mt1607.xyz/health`
- Frontend: `https://mt1607.xyz/prm/`
- API: `https://mt1607.xyz/prm/api/health` (if implemented)

### Viewing Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Backup and Recovery
The deployment script automatically creates backups in `./backups/`.

To restore a backup:
```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Restore volume data
docker run --rm -v prm_app-data:/data -v $(pwd)/backups:/backup alpine tar xzf /backup/volumes_TIMESTAMP.tar.gz -C /data

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

### SSL/HTTPS Setup

To enable HTTPS:

1. **Get SSL certificate** (Let's Encrypt recommended):
   ```bash
   sudo apt install certbot
   sudo certbot certonly --standalone -d mt1607.xyz
   ```

2. **Update nginx configuration** to include SSL:
   ```nginx
   server {
       listen 443 ssl http2;
       ssl_certificate /etc/letsencrypt/live/mt1607.xyz/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/mt1607.xyz/privkey.pem;
       # ... rest of config
   }
   ```

3. **Mount SSL certificates** in docker-compose:
   ```yaml
   volumes:
     - /etc/letsencrypt/live/mt1607.xyz:/etc/nginx/ssl:ro
   ```

## Troubleshooting

### Common Issues

1. **Build fails**: Check Dockerfile paths and dependencies
2. **Health checks fail**: Verify service startup and port configuration
3. **502 Bad Gateway**: Check backend service health and networking
4. **Static files not loading**: Verify nginx configuration and build output

### Debug Commands
```bash
# Check container status
docker ps -a

# Check logs
docker logs prm-backend
docker logs prm-frontend
docker logs prm-nginx

# Access container shell
docker exec -it prm-backend sh

# Test connectivity
docker exec prm-nginx wget -qO- http://backend:5000/health
```

### Performance Optimization

1. **Enable gzip compression** (already configured in nginx.conf)
2. **Optimize Docker images** (multi-stage builds used)
3. **Configure caching headers** (already configured)
4. **Monitor resource usage**:
   ```bash
   docker stats
   ```

## Security Considerations

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Use non-root users in containers (configured)

## Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
