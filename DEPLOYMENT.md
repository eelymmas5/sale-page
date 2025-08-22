# Deployment Guide
## Sales Page WordPress + Next.js Docker Setup

This guide provides step-by-step instructions for deploying the sales page application using Docker, making it easy for clients to set up and run.

## Prerequisites

- **Docker**: Version 20.0 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository
- **Domain/Server**: For production deployment (optional for local development)

### Installing Docker

#### Windows
1. Download Docker Desktop from https://docker.com/products/docker-desktop
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted

#### macOS
1. Download Docker Desktop from https://docker.com/products/docker-desktop
2. Drag Docker.app to Applications folder
3. Launch Docker from Applications

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker
```

## Quick Start (Local Development)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repository-url>
cd sales-page

# Copy environment configuration
cp .env.example .env

# Edit environment variables (optional for local development)
nano .env  # or use any text editor
```

### 2. Start Services
```bash
# Start all services (WordPress + Next.js + Database)
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### 3. Configure WordPress
1. **Access WordPress Admin**: http://localhost:8080/wp-admin
2. **Complete WordPress Installation**:
   - Language: English
   - Site Title: Your Sales Page
   - Username: admin
   - Password: (choose a strong password)
   - Email: your-email@domain.com

3. **Install Required Plugins**:
   - WPGraphQL: `docker-compose exec wordpress wp plugin install wp-graphql --activate`
   - ACF to WPGraphQL: `docker-compose exec wordpress wp plugin install wp-graphql-acf --activate`

### 4. Access Your Site
- **Sales Page**: http://localhost:3000
- **WordPress Admin**: http://localhost:8080/wp-admin
- **GraphQL Endpoint**: http://localhost:8080/graphql

## Production Deployment

### 1. Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Application Deployment
```bash
# Clone repository
git clone <your-repository-url>
cd sales-page

# Set up environment variables for production
cp .env.example .env

# Edit production environment variables
nano .env
```

**Required Production Environment Variables:**
```env
# Site Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
SITE_NAME="Your Site Name"

# WordPress Configuration
WORDPRESS_API_URL=http://wordpress/graphql
NEXT_PUBLIC_WORDPRESS_API_URL=https://yourdomain.com/graphql

# Database Security (CHANGE THESE!)
MYSQL_PASSWORD=your-secure-password
MYSQL_ROOT_PASSWORD=your-secure-root-password
WORDPRESS_DB_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-long-random-string-here
```

### 3. SSL Setup (Recommended)
```bash
# Install Certbot for Let's Encrypt SSL
sudo apt install certbot

# Generate SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy SSL files to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/
```

### 4. Deploy
```bash
# Build and start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check service status
docker-compose ps
```

## WordPress Configuration

### 1. Install Required Plugins
```bash
# WPGraphQL
docker-compose exec wordpress wp plugin install wp-graphql --activate

# Advanced Custom Fields (ACF)
docker-compose exec wordpress wp plugin install advanced-custom-fields --activate

# ACF to WPGraphQL
docker-compose exec wordpress wp plugin install wp-graphql-acf --activate

# Yoast SEO (optional)
docker-compose exec wordpress wp plugin install wordpress-seo --activate
```

### 2. Configure Custom Fields
1. Go to **Custom Fields > Field Groups** in WordPress admin
2. Create a new field group called "Homepage Fields"
3. Add the following fields:
   - Hero Title (Text)
   - Hero Subtitle (Textarea)
   - Hero CTA Text (Text)
   - Hero CTA URL (URL)
   - Features Title (Text)
   - Features (Repeater with Title, Description, Icon subfields)
   - Testimonials Title (Text)
   - Testimonials (Repeater with Name, Content, Rating, Image subfields)
   - Pricing Title (Text)
   - Pricing Plans (Repeater with Name, Price, Period, Features, etc.)

4. Set location rules to show on homepage

### 3. Upload Content
1. **Upload Images**: Go to Media Library and upload your gallery images
2. **Create Homepage**: Create a new page called "Homepage" and set as front page
3. **Fill Custom Fields**: Add content to the custom fields you created
4. **Set Featured Image**: Set a hero background image as the featured image

## Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart Next.js container
docker-compose up -d --build nextjs

# Restart all services if needed
docker-compose restart
```

### Database Backup
```bash
# Create backup
docker-compose exec db mysqldump -u wordpress -pwordpress_password wordpress > backup_$(date +%Y%m%d).sql

# Restore from backup
docker-compose exec -i db mysql -u wordpress -pwordpress_password wordpress < backup_20231201.sql
```

### Logs and Troubleshooting
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs nextjs
docker-compose logs wordpress
docker-compose logs db

# Check service status
docker-compose ps

# Restart a specific service
docker-compose restart nextjs
```

## Performance Optimization

### 1. Enable Redis Caching (Optional)
Add to `docker-compose.yml`:
```yaml
redis:
  image: redis:alpine
  container_name: sales-page-redis
  restart: unless-stopped
  networks:
    - sales-page-network
```

### 2. Configure CDN
1. Set up a CDN service (Cloudflare, AWS CloudFront, etc.)
2. Update image URLs in environment variables
3. Configure cache headers in nginx

### 3. Database Optimization
```bash
# Optimize database tables
docker-compose exec db mysql -u wordpress -pwordpress_password -e "OPTIMIZE TABLE wordpress.wp_posts, wordpress.wp_options;"
```

## Security Best Practices

### 1. Change Default Passwords
- WordPress admin password
- Database passwords
- JWT secret

### 2. Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. Regular Updates
- Keep Docker images updated
- Update WordPress core and plugins regularly
- Monitor security advisories

## Troubleshooting

### Common Issues

**Issue: Cannot connect to WordPress GraphQL**
```bash
# Check if WordPress is running
docker-compose ps

# Check WordPress logs
docker-compose logs wordpress

# Verify GraphQL plugin is active
docker-compose exec wordpress wp plugin list
```

**Issue: Next.js build fails**
```bash
# Check Node.js version in container
docker-compose exec nextjs node --version

# Rebuild with no cache
docker-compose build --no-cache nextjs
```

**Issue: Database connection errors**
```bash
# Check database container
docker-compose logs db

# Verify database credentials
docker-compose exec db mysql -u wordpress -pwordpress_password
```

**Issue: SSL certificate problems**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Update nginx configuration
sudo nginx -t && sudo nginx -s reload
```

### Getting Help

1. **Check Logs**: Always start by checking container logs
2. **Verify Environment**: Ensure all environment variables are set correctly
3. **Test Connections**: Verify database and API connections
4. **Documentation**: Refer to Next.js and WordPress documentation
5. **Support**: Contact your development team with specific error messages

## Monitoring

### Basic Health Checks
```bash
# Check if all services are running
docker-compose ps

# Test Next.js health
curl http://localhost:3000

# Test WordPress health
curl http://localhost:8080

# Test database connection
docker-compose exec db mysql -u wordpress -pwordpress_password -e "SELECT 1;"
```

### Performance Monitoring
- Monitor response times
- Check memory usage: `docker stats`
- Monitor disk space: `df -h`
- Check error logs regularly

This deployment guide should help clients successfully set up and maintain their sales page application. For additional support, refer to the official Docker, Next.js, and WordPress documentation.