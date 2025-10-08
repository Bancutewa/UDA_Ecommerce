# Check Docker Status Script
Write-Host "🔍 Checking Docker status..." -ForegroundColor Cyan

$maxAttempts = 30
$attempt = 0
$isReady = $false

while ($attempt -lt $maxAttempts -and -not $isReady) {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts..." -ForegroundColor Yellow
    
    try {
        $result = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            $isReady = $true
            Write-Host "✅ Docker is ready!" -ForegroundColor Green
            Write-Host ""
            docker version
            break
        }
    } catch {
        # Continue waiting
    }
    
    if (-not $isReady) {
        Write-Host "⏳ Waiting for Docker to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $isReady) {
    Write-Host "❌ Docker failed to start within expected time" -ForegroundColor Red
    Write-Host "Please check Docker Desktop manually" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Docker is ready! You can now run:" -ForegroundColor Green
Write-Host "   docker-compose up -d db redis" -ForegroundColor Cyan
