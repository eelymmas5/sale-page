# Sales Page - Next.js WordPress Integration

A high-performance, SEO-optimized sales page built with Next.js 14 App Router and WordPress as a headless CMS. Features server-side rendering, image carousel with SwiperJS, and complete Docker deployment setup.

## ✨ Features

- 🚀 **Next.js 14** with App Router for optimal performance
- 🎨 **Tailwind CSS + DaisyUI** for beautiful, responsive design
- 📸 **SwiperJS Carousel** for interactive image galleries
- 📊 **WordPress GraphQL** integration for content management
- 🔍 **SEO Optimized** with metadata API, sitemaps, and structured data
- ⚡ **Server-Side Rendering** for better SEO and performance
- 🐳 **Docker Ready** with complete deployment setup
- 📱 **Mobile First** responsive design approach
- 🎯 **Conversion Focused** layout for sales and marketing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: WordPress (Headless CMS)
- **Data Fetching**: Apollo GraphQL Client
- **Image Carousel**: SwiperJS
- **Deployment**: Docker, Docker Compose
- **SEO**: Next.js Metadata API, JSON-LD structured data

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the repository

### 1. Clone and Setup
```bash
git clone <repository-url>
cd sales-page
./scripts/setup.sh
```

The setup script will:
- Create environment configuration
- Start all Docker services
- Install WordPress plugins
- Set up the development environment

### 2. Access Your Site
- **Sales Page**: http://localhost:3000
- **WordPress Admin**: http://localhost:8080/wp-admin
- **GraphQL Endpoint**: http://localhost:8080/graphql

## 📖 Documentation

- **[Deployment Guide](DEPLOYMENT.md)**: Complete deployment instructions
- **[Project Requirements](PRD.md)**: Detailed project specifications

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── ui/                # Reusable UI components
│   ├── sections/          # Page sections
│   └── common/            # Shared components
├── lib/
│   ├── apollo-client.ts   # GraphQL client setup
│   ├── queries.ts         # GraphQL queries
│   └── seo.ts            # SEO utilities
├── types/
│   ├── wordpress.ts       # WordPress types
│   └── index.ts           # General types
└── styles/
    └── globals.css        # Global styles
```

## 🎯 Page Sections

1. **Hero Section**: Eye-catching header with call-to-action
2. **Features Section**: Highlight key features and benefits
3. **Image Carousel**: Interactive gallery powered by SwiperJS
4. **Testimonials**: Customer reviews and social proof
5. **Pricing Section**: Clear pricing tiers and plans
6. **Contact Section**: Contact form and information

## 🔧 Development Commands

```bash
# Start development environment
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Backup data
./scripts/backup.sh
```

## 📊 WordPress Setup

### Required Plugins
- **WPGraphQL**: GraphQL API for WordPress
- **Advanced Custom Fields (ACF)**: Custom fields management
- **ACF to WPGraphQL**: Expose ACF fields to GraphQL

### Custom Fields Setup
Create a field group called "Homepage Fields" with:
- Hero Title, Subtitle, CTA Text, CTA URL
- Features (repeater with title, description, icon)
- Testimonials (repeater with name, content, rating, image)
- Pricing Plans (repeater with name, price, features, etc.)

## 🔍 SEO Features

- **Meta Tags**: Dynamic title, description, keywords
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **JSON-LD**: Structured data for search engines
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling instructions
- **Image Optimization**: Next.js Image component with WebP

## 🚀 Performance Optimizations

- **Server-Side Rendering**: All content rendered on server
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Dynamic imports for optimal bundle size
- **Caching**: GraphQL query caching and static generation
- **Compression**: Gzip compression via Nginx
- **CDN Ready**: Optimized for CDN deployment

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch Friendly**: Swiper carousel with touch support
- **Accessible**: WCAG 2.1 compliance considerations

## 🔒 Security Features

- **Environment Variables**: Secure credential management
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Sanitized user inputs
- **Security Headers**: CSP, HSTS, and other security headers
- **Docker Security**: Non-root user containers

## 📈 Analytics & Monitoring

Ready for integration with:
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel
- Custom tracking events

## 🌐 Deployment Options

### Local Development
- Docker Compose setup included
- Hot reloading for development
- WordPress admin access

### Production Deployment
- Complete Docker setup
- Nginx reverse proxy
- SSL/TLS configuration
- Database persistence
- Automated backups

### Cloud Deployment
Compatible with:
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## 📞 Support

For support and questions:
1. Check the [Deployment Guide](DEPLOYMENT.md)
2. Review Docker logs: `docker-compose logs`
3. Verify environment variables in `.env`
4. Ensure all WordPress plugins are installed

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Built with ❤️ for high-converting sales pages**