# 🚕 Uber Clone Application

A modern ride-sharing application built with Next.js, Firebase, and PostgreSQL, featuring real-time location tracking, ride booking, and payment integration.

## ✨ Features

- 🔐 **Authentication**
  - Firebase Authentication
  - Social login (Google, Facebook)
  - JWT-based API authentication

- 🗺️ **Location & Navigation**
  - Real-time location tracking
  - Route optimization
  - ETA calculation
  - Driver matching

- 💳 **Payments**
  - Secure payment processing
  - Multiple payment methods
  - Fare calculation
  - Ride history

- 📱 **User Experience**
  - Real-time updates
  - Push notifications
  - Email notifications
  - Responsive design

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 13+
  - React 18+
  - TailwindCSS
  - Mapbox GL

- **Backend**
  - Next.js API Routes
  - PostgreSQL (AWS RDS)
  - Firebase Services
  - Redis (caching)

- **DevOps**
  - Docker
  - AWS ECS
  - GitHub Actions
  - Ansible

## 🚀 Getting Started

1. **Prerequisites**
   ```bash
   node >= 18.0.0
   npm >= 9.0.0
   docker (optional)
   ```

2. **Installation**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd uber-clone

   # Install dependencies
   npm install

   # Set up environment
   cp .env.example .env
   ```

3. **Environment Variables**
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=uber_clone
   DB_USER=postgres
   DB_PASSWORD=your_password

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Mapbox
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Development**
   ```bash
   # Start development server
   npm run dev

   # Run tests
   npm test

   # Build for production
   npm run build
   ```

## 🐳 Docker Development

```bash
# Build image
docker build -t uber-clone:dev .

# Run container
docker run -p 3000:3000 --env-file .env uber-clone:dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔍 Health Checks

The application includes a health check endpoint at `/api/health` that monitors:
- Database connectivity
- System resources
- Application uptime
- Memory usage

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify credentials in `.env`
   - Check RDS instance status
   - Verify security groups

2. **Firebase Auth**
   - Check Firebase configuration
   - Verify project status
   - Validate API keys

3. **Mapbox Integration**
   - Verify access token
   - Check permissions
   - Validate initialization

4. **Docker Issues**
   ```bash
   # Clear cache
   docker system prune

   # Rebuild
   docker build --no-cache

   # Check logs
   docker logs <container-id>
   ```

## 🔒 Security

- Environment variables for secrets
- JWT authentication
- Secure cookie handling
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Input validation

## 📈 Monitoring

- AWS CloudWatch metrics
- Application health checks
- Error tracking
- Performance monitoring
- Resource utilization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙋‍♂️ Support

For support:
1. Check troubleshooting guide
2. Search existing issues
3. Create new issue with:
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
