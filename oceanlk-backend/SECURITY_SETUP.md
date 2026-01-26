# Security Setup Guide

This guide explains how to configure environment variables and MongoDB Atlas IP whitelisting for the Ocean LK backend application.

## Table of Contents
- [Environment Variables Setup](#environment-variables-setup)
- [MongoDB Atlas IP Whitelisting](#mongodb-atlas-ip-whitelisting)
- [Production Considerations](#production-considerations)
- [Troubleshooting](#troubleshooting)

---

## Environment Variables Setup

### Overview
All sensitive credentials (MongoDB passwords, JWT secrets, email credentials) are now stored in environment variables instead of the `application.properties` file. This prevents credentials from being committed to version control.

### Required Environment Variables

The following environment variables must be set before running the application:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_USERNAME` | MongoDB Atlas username | `dm_db_user` |
| `MONGODB_PASSWORD` | MongoDB Atlas password | `bKHweGnO9k6FXvgt` |
| `MONGODB_CLUSTER` | MongoDB Atlas cluster URL | `cluster0.xe161cj.mongodb.net` |
| `MONGODB_DATABASE` | Database name | `oceanlk` |
| `JWT_SECRET` | Secret key for JWT token generation | `your_super_secret_key_2026` |
| `JWT_EXPIRATION` | JWT token expiration time (ms) | `86400000` (optional, defaults to 24h) |
| `MAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP server port | `587` |
| `MAIL_USERNAME` | Email account username | `your-email@gmail.com` |
| `MAIL_PASSWORD` | Email account password/app password | `your-app-password` |
| `EMAIL_FROM` | From email address | `noreply@oceanlk.com` |
| `EMAIL_HR` | HR email address | `hr@omc.lk` |
| `SERVER_PORT` | Server port (optional) | `8080` (default) |

### Initial Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and replace placeholder values with your actual credentials:**
   ```bash
   notepad .env
   ```

3. **⚠️ IMPORTANT:** Never commit the `.env` file to version control! It's already listed in `.gitignore`.

---

## Setting Environment Variables

### Option 1: Using IntelliJ IDEA (Recommended for Development)

1. **Open Run Configuration:**
   - Click `Run` → `Edit Configurations...`
   - Select your Spring Boot configuration (or create one)

2. **Add Environment Variables:**
   - Find the "Environment variables" field
   - Click the folder icon to open the environment variables dialog
   - Add each variable from the table above
   - Click "OK" to save

3. **Run the application:**
   - Click the green play button or press `Shift + F10`

**Example Environment Variables String (for IntelliJ):**
```
MONGODB_USERNAME=dm_db_user;MONGODB_PASSWORD=bKHweGnO9k6FXvgt;MONGODB_CLUSTER=cluster0.xe161cj.mongodb.net;MONGODB_DATABASE=oceanlk;JWT_SECRET=oceanlk_super_secret_jwt_key_change_this_in_production_2026;JWT_EXPIRATION=86400000;MAIL_HOST=smtp.gmail.com;MAIL_PORT=587;MAIL_USERNAME=your-email@gmail.com;MAIL_PASSWORD=your-app-password;EMAIL_FROM=noreply@oceanlk.com;EMAIL_HR=hr@omc.lk
```

### Option 2: Using PowerShell (Windows)

**For Current Session Only:**
```powershell
$env:MONGODB_USERNAME="dm_db_user"
$env:MONGODB_PASSWORD="bKHweGnO9k6FXvgt"
$env:MONGODB_CLUSTER="cluster0.xe161cj.mongodb.net"
$env:MONGODB_DATABASE="oceanlk"
$env:JWT_SECRET="oceanlk_super_secret_jwt_key_change_this_in_production_2026"
$env:JWT_EXPIRATION="86400000"
$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="your-app-password"
$env:EMAIL_FROM="noreply@oceanlk.com"
$env:EMAIL_HR="hr@omc.lk"
```

Then run:
```powershell
mvn spring-boot:run
```

**For Persistent Variables (System-wide):**
1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables" or "System variables", click "New"
5. Add each variable name and value
6. Restart your terminal/IDE

### Option 3: Using Command Prompt (Windows)

**For Current Session Only:**
```cmd
set MONGODB_USERNAME=dm_db_user
set MONGODB_PASSWORD=bKHweGnO9k6FXvgt
set MONGODB_CLUSTER=cluster0.xe161cj.mongodb.net
set MONGODB_DATABASE=oceanlk
set JWT_SECRET=oceanlk_super_secret_jwt_key_change_this_in_production_2026
set JWT_EXPIRATION=86400000
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MAIL_USERNAME=your-email@gmail.com
set MAIL_PASSWORD=your-app-password
set EMAIL_FROM=noreply@oceanlk.com
set EMAIL_HR=hr@omc.lk
```

Then run:
```cmd
mvn spring-boot:run
```

### Option 4: Using a `.env` File with Spring Boot

> [!NOTE]
> Spring Boot doesn't natively support `.env` files. You need to use one of the methods above, or use a library like `spring-dotenv` or `spring-boot-dotenv`.

If you want to use a `.env` file directly, consider adding the `spring-dotenv` dependency to `pom.xml`:

```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

---

## MongoDB Atlas IP Whitelisting

### Current Status
Your MongoDB Atlas cluster currently allows access from **0.0.0.0/0** (anywhere). While this is convenient for development, it should be restricted for production.

### Step-by-Step: Adding Your Current IP

1. **Login to MongoDB Atlas:**
   - Go to https://cloud.mongodb.com/
   - Sign in with your credentials

2. **Navigate to Network Access:**
   - In the left sidebar, click "Network Access" under "Security"
   - Or use this direct link: https://cloud.mongodb.com/v2/696db0eea8b19d1c547628d9#/security/network/accessList

3. **Review Current IP Whitelist:**
   - You should see `0.0.0.0/0` listed (allow from anywhere)

4. **Add Your Current IP:**
   - Click "Add IP Address" button
   - Click "Add Current IP Address" (MongoDB will auto-detect your public IP)
   - Add a meaningful comment like "Development - My Home IP"
   - Click "Confirm"

5. **Remove 0.0.0.0/0 (Optional for Development):**
   - If you want to restrict access, click the trash icon next to `0.0.0.0/0`
   - **⚠️ WARNING:** Only do this if you've added your current IP first!
   - Click "Delete" to confirm

### Adding Production Server IPs

When deploying to production:

1. **Get Your Server's Public IP:**
   - For AWS: Find the Elastic IP or EC2 instance public IP
   - For Azure: Find the public IP address of your App Service or VM
   - For Google Cloud: Find the external IP of your Compute Engine instance
   - For Heroku: Use the Heroku Scheduler IP ranges

2. **Add the IP to MongoDB Atlas:**
   - Click "Add IP Address"
   - Enter the IP address or CIDR block
   - Add a comment like "Production - AWS Server"
   - Click "Confirm"

### IP Whitelisting Best Practices

✅ **DO:**
- Use specific IP addresses for production servers
- Document what each IP address is for
- Use CIDR notation for IP ranges (e.g., `192.168.1.0/24`)
- Regularly audit and remove unused IPs

❌ **DON'T:**
- Use `0.0.0.0/0` in production
- Share IP whitelist access between environments
- Forget to update IPs when infrastructure changes

---

## Production Considerations

### Environment Variables in Production

**For Docker:**
```dockerfile
ENV MONGODB_USERNAME=your_username
ENV MONGODB_PASSWORD=your_password
# ... other variables
```

Or use `docker-compose.yml`:
```yaml
environment:
  - MONGODB_USERNAME=your_username
  - MONGODB_PASSWORD=your_password
  # ... other variables
```

**For Cloud Services:**
- **AWS Elastic Beanstalk:** Use `eb setenv` or AWS Console
- **Azure App Service:** Use Application Settings in the portal
- **Google Cloud:** Use Cloud Console or `gcloud` CLI
- **Heroku:** Use `heroku config:set VARIABLE=value`

### Security Best Practices

1. **Use Strong, Unique Passwords:**
   - MongoDB password should be at least 16 characters
   - JWT secret should be at least 32 characters
   - Use a password manager to generate and store secrets

2. **Rotate Credentials Regularly:**
   - Change MongoDB password every 90 days
   - Regenerate JWT secret when team members leave
   - Update email app passwords when needed

3. **Separate Environments:**
   - Use different credentials for development, staging, and production
   - Never use production credentials in development

4. **Enable MongoDB Atlas Security Features:**
   - Enable database authentication (already done)
   - Use IP whitelisting (covered above)
   - Enable audit logging for production
   - Enable encryption at rest

---

## Troubleshooting

### Application Won't Start - Missing Environment Variables

**Error:**
```
Could not resolve placeholder 'MONGODB_USERNAME' in value "mongodb+srv://${MONGODB_USERNAME}:..."
```

**Solution:**
- Ensure all required environment variables are set
- Check for typos in variable names
- Restart your IDE/terminal after setting system environment variables

### MongoDB Connection Failed - IP Not Whitelisted

**Error:**
```
Connection refused to cluster0.xe161cj.mongodb.net
```

**Solution:**
- Add your current IP to MongoDB Atlas Network Access
- If using a VPN, add your VPN's public IP
- Verify the correct cluster URL in `MONGODB_CLUSTER`

### Email Sending Failed - Invalid Credentials

**Error:**
```
AuthenticationFailedException: 535-5.7.8 Username and Password not accepted
```

**Solution:**
- For Gmail, use an "App Password" instead of your regular password
- Enable "Less secure app access" or use OAuth2
- Verify `MAIL_USERNAME` and `MAIL_PASSWORD` are correct

### JWT Token Issues

**Error:**
```
Invalid JWT token
```

**Solution:**
- Ensure `JWT_SECRET` is the same across all instances
- Check that `JWT_EXPIRATION` is a valid number (in milliseconds)
- Clear browser cookies and try again

---

## Quick Reference

### Current Credentials (Replace These!)

Based on your `application.properties`, your current values are:

```bash
MONGODB_USERNAME=dm_db_user
MONGODB_PASSWORD=bKHweGnO9k6FXvgt
MONGODB_CLUSTER=cluster0.xe161cj.mongodb.net
MONGODB_DATABASE=oceanlk
JWT_SECRET=oceanlk_super_secret_jwt_key_change_this_in_production_2026
JWT_EXPIRATION=86400000
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@oceanlk.com
EMAIL_HR=hr@omc.lk
SERVER_PORT=8080
```

**⚠️ IMPORTANT:** Update `MAIL_USERNAME`, `MAIL_PASSWORD`, and `JWT_SECRET` with your actual values!

---

## Need Help?

If you encounter issues not covered in this guide:
1. Check the application logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas IP whitelist includes your current IP
4. Contact the development team for assistance

---

**Last Updated:** January 26, 2026
