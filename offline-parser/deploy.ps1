# Cloud Run Deployment Script for Future Job Fit Offline Parser
# Requires gcloud CLI to be installed and authenticated

$PROJECT_ID = "future-job-fit" # Update this with your project ID
$REGION = "us-central1"
$SERVICE_NAME = "resume-offline-parser"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "🚀 Starting Deployment of Offline Parser to Cloud Run..." -ForegroundColor Cyan

# 1. Build the image using Cloud Build
Write-Host "📦 Building container image..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE_NAME .

# 2. Deploy to Cloud Run
Write-Host "🌎 Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image $IMAGE_NAME `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --memory 1Gi `
    --cpu 1 `
    --timeout 300

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
$URL = gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
Write-Host "🔗 Service URL: $URL" -ForegroundColor White
Write-Host "💡 Update your .env.local: VITE_OFFLINE_PARSER_URL=$URL" -ForegroundColor Magenta
