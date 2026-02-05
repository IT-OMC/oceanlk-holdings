# ================================================================
# OceanLK Backend - Start with Email Configuration
# ================================================================
# This script starts the backend with email configuration enabled
# Run this from the oceanlk-backend directory
# ================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OceanLK Backend - Starting with Email" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "pom.xml")) {
    Write-Host "ERROR: pom.xml not found!" -ForegroundColor Red
    Write-Host "Please run this script from the oceanlk-backend directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found pom.xml" -ForegroundColor Green
Write-Host "✓ Email configured with: minidu.punsara19@gmail.com" -ForegroundColor Green
Write-Host "✓ Profile: local" -ForegroundColor Green
Write-Host ""

Write-Host "Starting Spring Boot application with local profile..." -ForegroundColor Yellow
Write-Host ""

# Start the application with local profile
mvn spring-boot:run -Dspring-boot.run.profiles=local

Write-Host ""
Write-Host "Application stopped." -ForegroundColor Yellow
