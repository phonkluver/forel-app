# PowerShell script to fix file encoding to UTF-8

Write-Host "Fixing file encoding to UTF-8..." -ForegroundColor Green

# Function to fix file encoding
function Fix-FileEncoding {
    param([string]$FilePath)
    
    try {
        Write-Host "Processing: $FilePath" -ForegroundColor Yellow
        
        # Read file content
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        
        # Write back with UTF-8 encoding
        Set-Content -Path $FilePath -Value $content -Encoding UTF8
        
        Write-Host "✅ Fixed: $FilePath" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error processing $FilePath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Files to fix
$filesToFix = @(
    "telegram-bot\bot.js",
    "api-server\server.js", 
    "my-project-web\src\components\MenuComponent.tsx",
    "my-project\src\components\MenuComponent.tsx"
)

# Fix each file
foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        Fix-FileEncoding -FilePath $file
    } else {
        Write-Host "⚠️ File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Encoding fix completed!" -ForegroundColor Green
