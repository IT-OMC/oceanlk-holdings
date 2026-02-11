# OceanLK API Endpoint Testing Script
# Tests all public and authenticated endpoints

$baseUrl = "http://localhost:8080"
$results = @()
$token = $null

# Helper function to test endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [string]$ContentType = "application/json"
    )
    
    $url = "$baseUrl$Endpoint"
    $result = [PSCustomObject]@{
        Method = $Method
        Endpoint = $Endpoint
        Description = $Description
        Status = "UNKNOWN"
        StatusCode = $null
        ResponseTime = $null
        Error = $null
    }
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $Headers
            ErrorAction = 'Stop'
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params['Body'] = ($Body | ConvertTo-Json -Depth 10)
            $params['ContentType'] = $ContentType
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        $stopwatch.Stop()
        
        $result.Status = "SUCCESS"
        $result.StatusCode = $response.StatusCode
        $result.ResponseTime = "$($stopwatch.ElapsedMilliseconds)ms"
    }
    catch {
        $stopwatch.Stop()
        $result.Status = "FAILED"
        $result.ResponseTime = "$($stopwatch.ElapsedMilliseconds)ms"
        $result.Error = $_.Exception.Message
        
        if ($_.Exception.Response) {
            $result.StatusCode = $_.Exception.Response.StatusCode.value__
            
            # Try to read error body
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $body = $reader.ReadToEnd()
                if ($body) {
                    $result.Error += " | Body: $body"
                }
            } catch {
                # Ignore body reading errors
            }
        } else {
             $result.StatusCode = 500 # Default if no response
        }
    }
    
    return $result
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "OceanLK API Endpoint Testing" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# PHASE 1: PUBLIC ENDPOINTS
# ============================================
Write-Host "PHASE 1: Testing Public Endpoints..." -ForegroundColor Yellow
Write-Host ""

# Media & Content
Write-Host "Testing Media endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/media" -Description "Get all published media"
$results += Test-Endpoint -Method "GET" -Endpoint "/api/media/gallery" -Description "Get gallery media"
$results += Test-Endpoint -Method "GET" -Endpoint "/api/media/news" -Description "Get news articles"
$results += Test-Endpoint -Method "GET" -Endpoint "/api/media/blogs" -Description "Get blog posts"
$results += Test-Endpoint -Method "GET" -Endpoint "/api/media/media" -Description "Get media items"

# Companies
Write-Host "Testing Company endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/companies" -Description "Get all companies"

# Jobs
Write-Host "Testing Job endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/jobs" -Description "Get active jobs"

# Leadership
Write-Host "Testing Leadership endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/leadership" -Description "Get all leadership"

# Partners
Write-Host "Testing Partner endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/partners" -Description "Get all partners"

# Testimonials
Write-Host "Testing Testimonial endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/testimonials" -Description "Get all testimonials"

# Events
Write-Host "Testing Event endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/events" -Description "Get all events"

# WhatsApp
Write-Host "Testing WhatsApp endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/public/whatsapp" -Description "Get WhatsApp number"

# Metrics
Write-Host "Testing Metrics endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/metrics" -Description "Get global metrics"

# Leadership Categories
Write-Host "Testing Leadership Category endpoints..." -ForegroundColor Green
$results += Test-Endpoint -Method "GET" -Endpoint "/api/leadership-categories" -Description "Get leadership categories"

# ============================================
# PHASE 2: AUTHENTICATION
# ============================================
Write-Host ""
Write-Host "PHASE 2: Testing Authentication..." -ForegroundColor Yellow
Write-Host ""

# Try to login - you'll need to provide valid credentials
Write-Host "Attempting admin login..." -ForegroundColor Green

# Check if DataInitializer creates a default admin
$loginBody = @{
    username = "admin"
    password = "admin123"
}

$loginResult = Test-Endpoint -Method "POST" -Endpoint "/api/admin/login" -Description "Admin login" -Body $loginBody

$results += $loginResult

if ($loginResult.Status -eq "SUCCESS") {
    # Extract token from response
    try {
        $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/admin/login" -Method POST -Body ($loginBody | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop -UseBasicParsing
        $tokenData = $loginResponse.Content | ConvertFrom-Json
        $token = $tokenData.token
        Write-Host "[+] Login successful! Token obtained." -ForegroundColor Green
    }
    catch {
        Write-Host "[-] Failed to extract token" -ForegroundColor Red
    }
}
else {
    Write-Host "[-] Login failed. Cannot test authenticated endpoints." -ForegroundColor Red
    Write-Host "  Error: $($loginResult.Error)" -ForegroundColor Red
}

# ============================================
# PHASE 3: AUTHENTICATED ENDPOINTS
# ============================================
if ($token) {
    Write-Host ""
    Write-Host "PHASE 3: Testing Authenticated Endpoints..." -ForegroundColor Yellow
    Write-Host ""
    
    $authHeaders = @{
        "Authorization" = "Bearer $token"
    }
    
    # Validate token
    Write-Host "Testing Auth endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/validate" -Description "Validate token" -Headers $authHeaders
    
    # Validating Token
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/jobs" -Description "Get active jobs"

    # Admin Management
    Write-Host "Testing Admin Management endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/management/list" -Description "Get all admins" -Headers $authHeaders
    
    # Media Management
    Write-Host "Testing Media Management endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/media" -Description "Get all media (admin)" -Headers $authHeaders
    
    # Job Management
    Write-Host "Testing Job Management endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/jobs" -Description "Get all jobs (admin)" -Headers $authHeaders
    
    # Talent Pool
    Write-Host "Testing Talent Pool endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/talent-pool/applications" -Description "Get talent pool applications" -Headers $authHeaders
    
    # Contact Messages
    Write-Host "Testing Contact Message endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/contact/messages" -Description "Get contact messages" -Headers $authHeaders
    
    # Notifications
    Write-Host "Testing Notification endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/notifications" -Description "Get notifications" -Headers $authHeaders
    
    # Pending Changes
    Write-Host "Testing Pending Changes endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/pending-changes" -Description "Get pending changes" -Headers $authHeaders
    
    # Audit Logs
    Write-Host "Testing Audit Log endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/audit-logs" -Description "Get audit logs" -Headers $authHeaders
    
    # System Health
    Write-Host "Testing System Health endpoints..." -ForegroundColor Green
    $results += Test-Endpoint -Method "GET" -Endpoint "/api/admin/system/test-email" -Description "Email health check" -Headers $authHeaders
}

# ============================================
# GENERATE REPORT
# ============================================
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$successCount = ($results | Where-Object { $_.Status -eq "SUCCESS" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAILED" }).Count
$totalCount = $results.Count

Write-Host "Total Endpoints Tested: $totalCount" -ForegroundColor White
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""

# Detailed results
Write-Host "DETAILED RESULTS:" -ForegroundColor Cyan
Write-Host ""

foreach ($result in $results) {
    $statusSymbol = if ($result.Status -eq "SUCCESS") { "[OK]" } else { "[FAIL]" }
    $statusColor = if ($result.Status -eq "SUCCESS") { "Green" } else { "Red" }
    
    Write-Host "$statusSymbol " -ForegroundColor $statusColor -NoNewline
    Write-Host "$($result.Method) $($result.Endpoint) " -NoNewline
    Write-Host "[$($result.StatusCode)] " -ForegroundColor Yellow -NoNewline
    Write-Host "$($result.ResponseTime)" -ForegroundColor Cyan
}

# Show failures in detail
if ($failCount -gt 0) {
    Write-Host ""
    Write-Host "FAILED ENDPOINTS DETAILS:" -ForegroundColor Red
    Write-Host ""
    
    $results | Where-Object { $_.Status -eq "FAILED" } | ForEach-Object {
        Write-Host "  [-] $($_.Method) $($_.Endpoint)" -ForegroundColor Red
        Write-Host "    Status Code: $($_.StatusCode)" -ForegroundColor Yellow
        Write-Host "    Error: $($_.Error)" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Export to JSON
$reportPath = Join-Path $PSScriptRoot "api-test-report.json"
$results | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "Full report saved to: $reportPath" -ForegroundColor Cyan
Write-Host ""

# Summary
if ($failCount -eq 0) {
    Write-Host "[SUCCESS] All endpoints are working properly!" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] Some endpoints failed. Review the details above." -ForegroundColor Yellow
}
