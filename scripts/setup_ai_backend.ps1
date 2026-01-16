$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting AI Backend Setup for FutureJobFit..." -ForegroundColor Cyan

# 1. Fix .env file encoding to prevent parsing errors
Write-Host "`n1️⃣  Sanitizing .env file..." -ForegroundColor Yellow
$EnvContent = @"
# Client-side (public)
VITE_SUPABASE_URL=https://bssbnbszgtlildyfrkhm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzc2JuYnN6Z3RsaWxkeWZya2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTgzMTgsImV4cCI6MjA4MzI5NDMxOH0.IjbTfP7m6gnR9O2ZMeQxxo-WgdoL8yvp4RWXmXu1cCQ
VITE_AI_PROVIDER=gemini

# Server-side (secrets placeholder)
GEMINI_API_KEY=your_gemini_api_key_here
"@
$EnvContent | Out-File -FilePath ".env" -Encoding ascii -Force
Write-Host "✅ .env file fixed (BOM removed)." -ForegroundColor Green

# 2. Login to Supabase
Write-Host "`n2️⃣  Authenticating with Supabase..." -ForegroundColor Yellow
Write-Host "   Please ensure you have a standard Access Token ready if prompted."
Write-Host "   Asking you to login interactively:"
npx supabase login

# 3. Set Secrets
Write-Host "`n3️⃣  Setting Production Secrets..." -ForegroundColor Yellow
$ProjectRef = "bssbnbszgtlildyfrkhm"
$GeminiKey = "AIzaSyBPs6YltYMLr9AkIqnq9TWx0ZjuGvcOJ9g"

npx supabase secrets set --project-ref $ProjectRef GEMINI_API_KEY=$GeminiKey AI_PROVIDER=gemini --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Secrets set successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set secrets." -ForegroundColor Red
    exit 1
}

# 4. Deploy Function
Write-Host "`n4️⃣  Deploying Edge Function (resume-ai)..." -ForegroundColor Yellow
# Rename .env temporarily to avoid conflicts during deploy
Rename-Item -Path ".env" -NewName ".env.backup" -ErrorAction SilentlyContinue

try {
    npx supabase functions deploy resume-ai --project-ref $ProjectRef --no-verify-jwt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 SUCCESS! AI Backend is live." -ForegroundColor Green
    } else {
        Write-Host "`n❌ Deployment failed." -ForegroundColor Red
    }
} finally {
    # Always restore .env
    Rename-Item -Path ".env.backup" -NewName ".env" -ErrorAction SilentlyContinue
}
