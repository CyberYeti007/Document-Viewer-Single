# PowerShell script to create blank files and folders for Unified Platform
# This script creates empty files only if they don't already exist

Write-Host "Creating Unified Platform structure..." -ForegroundColor Green

# Function to create directory if it doesn't exist
function Create-DirectoryIfNotExists {
    param($Path)
    if (!(Test-Path -Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "Created directory: $Path" -ForegroundColor Yellow
    } else {
        Write-Host "Directory exists: $Path" -ForegroundColor Cyan
    }
}

# Function to create empty file if it doesn't exist
function Create-FileIfNotExists {
    param($Path)
    if (!(Test-Path -Path $Path)) {
        New-Item -ItemType File -Path $Path -Force | Out-Null
        Write-Host "Created file: $Path" -ForegroundColor Green
    } else {
        Write-Host "File exists (skipping): $Path" -ForegroundColor Cyan
    }
}

# Create directories
Create-DirectoryIfNotExists -Path "src\app\login"
Create-DirectoryIfNotExists -Path "src\app\dashboard"

# Create files
Create-FileIfNotExists -Path "src\app\login\page.tsx"
Create-FileIfNotExists -Path "src\app\dashboard\page.tsx"
Create-FileIfNotExists -Path "src\app\dashboard\layout.tsx"
Create-FileIfNotExists -Path "src\app\providers.tsx"

# Note about files that might need updating (but won't be overwritten)
Write-Host "`nNote: The following existing files may need updates:" -ForegroundColor Magenta
Write-Host "  - src\app\page.tsx (home page redirect logic)" -ForegroundColor White
Write-Host "  - src\app\layout.tsx (add SessionProvider)" -ForegroundColor White
Write-Host "  - src\middleware.ts (update authentication logic)" -ForegroundColor White

Write-Host "`nStructure creation complete!" -ForegroundColor Green
Write-Host "You can now paste the code into the newly created files." -ForegroundColor Yellow