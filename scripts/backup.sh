#!/bin/bash

# Backup Script for Sales Page
# Creates backups of database and WordPress files

set -e

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

# Configuration
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="database_backup_${DATE}.sql"
FILES_BACKUP_FILE="wordpress_files_backup_${DATE}.tar.gz"

# Create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        print_success "Created backup directory: $BACKUP_DIR"
    fi
}

# Backup database
backup_database() {
    print_warning "Creating database backup..."
    
    # Get database credentials from .env file
    if [ -f .env ]; then
        source .env
    else
        print_error ".env file not found. Using default values."
        MYSQL_USER="wordpress"
        MYSQL_PASSWORD="wordpress_password"
        MYSQL_DATABASE="wordpress"
    fi
    
    # Create database backup
    docker-compose exec -T db mysqldump \
        -u "${MYSQL_USER}" \
        -p"${MYSQL_PASSWORD}" \
        "${MYSQL_DATABASE}" > "${BACKUP_DIR}/${DB_BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        print_success "Database backup created: ${BACKUP_DIR}/${DB_BACKUP_FILE}"
    else
        print_error "Failed to create database backup"
        return 1
    fi
}

# Backup WordPress files
backup_wordpress_files() {
    print_warning "Creating WordPress files backup..."
    
    # Create tar archive of WordPress files
    docker-compose exec -T wordpress tar czf - /var/www/html > "${BACKUP_DIR}/${FILES_BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        print_success "WordPress files backup created: ${BACKUP_DIR}/${FILES_BACKUP_FILE}"
    else
        print_error "Failed to create WordPress files backup"
        return 1
    fi
}

# Cleanup old backups (keep last 5)
cleanup_old_backups() {
    print_warning "Cleaning up old backups..."
    
    # Keep only the 5 most recent database backups
    ls -t "${BACKUP_DIR}"/database_backup_*.sql | tail -n +6 | xargs -r rm --
    
    # Keep only the 5 most recent file backups
    ls -t "${BACKUP_DIR}"/wordpress_files_backup_*.tar.gz | tail -n +6 | xargs -r rm --
    
    print_success "Cleaned up old backups"
}

# Show backup information
show_backup_info() {
    echo ""
    echo "📦 Backup Summary"
    echo "=================="
    echo "Backup location: $(pwd)/${BACKUP_DIR}"
    echo "Database backup: ${DB_BACKUP_FILE}"
    echo "Files backup: ${FILES_BACKUP_FILE}"
    echo ""
    echo "Backup sizes:"
    ls -lh "${BACKUP_DIR}/${DB_BACKUP_FILE}" 2>/dev/null || echo "Database backup: Not found"
    ls -lh "${BACKUP_DIR}/${FILES_BACKUP_FILE}" 2>/dev/null || echo "Files backup: Not found"
    echo ""
    echo "To restore from backup:"
    echo "• Database: docker-compose exec -i db mysql -u wordpress -pwordpress_password wordpress < ${BACKUP_DIR}/${DB_BACKUP_FILE}"
    echo "• Files: docker-compose exec -T wordpress tar xzf - -C / < ${BACKUP_DIR}/${FILES_BACKUP_FILE}"
}

# Main execution
main() {
    echo "🔄 Starting backup process..."
    echo "=============================="
    
    # Check if Docker services are running
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Docker services are not running. Please start them with 'docker-compose up -d'"
        exit 1
    fi
    
    create_backup_dir
    
    # Backup database
    if backup_database; then
        print_success "Database backup completed"
    else
        print_error "Database backup failed"
        exit 1
    fi
    
    # Backup WordPress files
    if backup_wordpress_files; then
        print_success "WordPress files backup completed"
    else
        print_error "WordPress files backup failed"
        exit 1
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    show_backup_info
    
    print_success "Backup process completed successfully!"
}

# Handle command line arguments
case "${1:-}" in
    "database")
        create_backup_dir
        backup_database
        print_success "Database backup completed!"
        ;;
    "files")
        create_backup_dir
        backup_wordpress_files
        print_success "WordPress files backup completed!"
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    *)
        main
        ;;
esac