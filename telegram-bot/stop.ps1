Write-Host "🛑 Stopping Telegram Restaurant Bot..." -ForegroundColor Red
Write-Host ""

# Find and stop bot processes
$botProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($botProcesses) {
    Write-Host "Found $($botProcesses.Count) Node.js process(es):" -ForegroundColor Yellow
    
    foreach ($process in $botProcesses) {
        Write-Host "  PID: $($process.Id) - Started: $($process.StartTime)" -ForegroundColor Gray
    }
    
    Write-Host ""
    $confirm = Read-Host "Do you want to stop all Node.js processes? (y/N)"
    
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        try {
            Stop-Process -Name "node" -Force
            Write-Host "✅ All Node.js processes stopped successfully" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error stopping processes: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Operation cancelled" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  No Node.js processes found running" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
