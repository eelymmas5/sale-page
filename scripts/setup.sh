#!/bin/bash

# Sales Page Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Sales Page Setup Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        docker --version
    else
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
}

# Check if Docker Compose is installed
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
        docker-compose --version
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    if [ ! -f .env ]; then
        print_warning "Creating .env file from template"
        cp .env.example .env
        print_success "Created .env file"
    else
        print_warning ".env file already exists, skipping..."
    fi
}

# Build and start services
start_services() {
    print_warning "Building and starting Docker services..."
    docker-compose up -d --build
    
    if [ $? -eq 0 ]; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    print_warning "Waiting for services to be ready..."
    
    # Wait for WordPress
    echo "Waiting for WordPress to be ready..."
    until curl -s http://localhost:8080 > /dev/null; do
        sleep 2
    done
    print_success "WordPress is ready"
    
    # Wait for Next.js (this might take longer on first build)
    echo "Waiting for Next.js to be ready..."
    until curl -s http://localhost:3000 > /dev/null; do
        sleep 2
    done
    print_success "Next.js is ready"
}

# Install WordPress plugins
install_wp_plugins() {
    print_warning "Installing WordPress plugins..."
    
    # Wait a bit more for WordPress to be fully ready
    sleep 10
    
    # Install WPGraphQL
    docker-compose exec -T wordpress wp plugin install wp-graphql --activate --allow-root
    if [ $? -eq 0 ]; then
        print_success "Installed WPGraphQL plugin"
    else
        print_error "Failed to install WPGraphQL plugin"
    fi
    
    # Install Advanced Custom Fields
    docker-compose exec -T wordpress wp plugin install advanced-custom-fields --activate --allow-root
    if [ $? -eq 0 ]; then
        print_success "Installed Advanced Custom Fields plugin"
    else
        print_error "Failed to install Advanced Custom Fields plugin"
    fi
    
    # Install ACF to WPGraphQL
    docker-compose exec -T wordpress wp plugin install wp-graphql-acf --activate --allow-root
    if [ $? -eq 0 ]; then
        print_success "Installed ACF to WPGraphQL plugin"
    else
        print_warning "Failed to install ACF to WPGraphQL plugin (manual installation may be required)"
    fi
}

# Create WordPress admin user
create_wp_admin() {
    print_warning "Creating WordPress admin user..."
    
    read -p "Enter admin username (default: admin): " admin_user
    admin_user=${admin_user:-admin}
    
    read -s -p "Enter admin password: " admin_pass
    echo
    
    read -p "Enter admin email: " admin_email
    
    # Install WordPress
    docker-compose exec -T wordpress wp core install \
        --url="http://localhost:8080" \
        --title="Sales Page" \
        --admin_user="$admin_user" \
        --admin_password="$admin_pass" \
        --admin_email="$admin_email" \
        --allow-root
    
    if [ $? -eq 0 ]; then
        print_success "WordPress admin user created successfully"
    else
        print_error "Failed to create WordPress admin user"
    fi
}

# Show final information
show_final_info() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "================="
    echo ""
    echo "Your services are now running:"
    echo "• Sales Page (Next.js): http://localhost:3000"
    echo "• WordPress Admin: http://localhost:8080/wp-admin"
    echo "• GraphQL Endpoint: http://localhost:8080/graphql"
    echo ""
    echo "Next steps:"
    echo "1. Visit WordPress admin to configure your content"
    echo "2. Create custom fields for homepage content"
    echo "3. Upload images to the media library"
    echo "4. Configure your sales page content"
    echo ""
    echo "Need help? Check the DEPLOYMENT.md file for detailed instructions."
}

# Main execution
main() {
    echo "Checking prerequisites..."
    check_docker
    check_docker_compose
    
    echo ""
    echo "Setting up environment..."
    setup_environment
    
    echo ""
    echo "Starting services..."
    start_services
    
    echo ""
    wait_for_services
    
    echo ""
    install_wp_plugins
    
    echo ""
    echo "Do you want to create a WordPress admin user now? (y/n)"
    read -r create_admin
    if [[ $create_admin =~ ^[Yy]$ ]]; then
        create_wp_admin
    else
        print_warning "Skipping WordPress admin user creation. You can create one later via WordPress setup wizard."
    fi
    
    show_final_info
}

# Run main function
main