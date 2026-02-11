# Environment Configuration Template

Copy this file to `.env` and fill in your actual values.

## MongoDB Configuration
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oceanlk?retryWrites=true&w=majority
```

## JWT Configuration
```bash
JWT_SECRET=your-super-long-random-secret-key-here-minimum-256-bits
JWT_EXPIRATION=86400000
```

## Email Configuration
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
EMAIL_ENABLED=true
```

## Default Admin Credentials
**⚠️ CRITICAL: Change these immediately after first deployment!**
```bash
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=ChangeMe123!@#
DEFAULT_SUPERADMIN_USERNAME=superadmin
DEFAULT_SUPERADMIN_PASSWORD=ChangeMe456!@#
```

## CORS Configuration
```bash
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Server Configuration
```bash
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

## Security Best Practices

### 1. Generate Strong JWT Secret
```bash
# Linux/Mac
openssl rand -base64 64

# Or use online generator
# https://randomkeygen.com/
```

### 2. MongoDB Security
- Create a dedicated database user with minimum required permissions
- Use IP whitelisting in MongoDB Atlas
- Never commit connection strings to version control

### 3. Email Security
- Use app-specific passwords for Gmail
- Consider using SendGrid, AWS SES, or similar services for production

### 4. Environment Variables
- Never commit `.env` files to version control
- Use secrets management in production (AWS Secrets Manager, HashiCorp Vault, etc.)
- Different `.env` for each environment (dev, staging, prod)

### 5. Password Requirements
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Change default passwords immediately

## Docker Deployment

Create a `.env` file for Docker Compose:
```bash
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=SecureMongoPassword123!

# Backend
JWT_SECRET=your-jwt-secret
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=SecurePassword123!
DEFAULT_SUPERADMIN_USERNAME=superadmin
DEFAULT_SUPERADMIN_PASSWORD=SecurePassword456!
CORS_ALLOWED_ORIGINS=http://localhost
SPRING_PROFILES_ACTIVE=prod
```

## Verification

After setting up your environment:

1. **Test MongoDB Connection**
   ```bash
   mongosh "your-mongodb-uri"
   ```

2. **Test Backend**
   ```bash
   cd oceanlk-backend
   mvn spring-boot:run
   ```

3. **Test Frontend**
   ```bash
   cd oceanlk-frontend
   npm run dev
   ```

4. **Verify Health Endpoints**
   - Backend: http://localhost:8080/actuator/health
   - Frontend: http://localhost:5173

## Production Checklist

- [ ] Change all default passwords
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Enable email service
- [ ] Add CDN for static assets
- [ ] Configure WAF (Web Application Firewall)
- [ ] Set up rate limiting
- [ ] Review and test all security headers
- [ ] Perform security audit
- [ ] Load testing
- [ ] Disaster recovery plan
