Write-Host "🤖 Starting Telegram Restaurant Bot..." -ForegroundColor Green
Write-Host ""

# Check if bot is already running
$botProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }

if ($botProcess) {
    Write-Host "⚠️  Bot is already running (PID: $($botProcess.Id))" -ForegroundColor Yellow
    Write-Host "To stop the bot, run: Stop-Process -Id $($botProcess.Id)" -ForegroundColor Cyan
} else {
    # Start bot in background
    Start-Process -FilePath "node" -ArgumentList "bot.js" -WorkingDirectory $PWD -WindowStyle Hidden
    
    Write-Host "✅ Bot started successfully in background" -ForegroundColor Green
    Write-Host "To check bot status, run: Get-Process -Name 'node'" -ForegroundColor Cyan
    Write-Host "To stop the bot, run: Stop-Process -Name 'node'" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
