#!/bin/bash
# Cloud Run Deployment Script for Future Job Fit Offline Parser

PROJECT_ID="future-job-fit" # Update this with your project ID
REGION="us-central1"
SERVICE_NAME="resume-offline-parser"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo -e "\033[0;36m🚀 Starting Deployment of Offline Parser to Cloud Run...\033[0m"

# 1. Build the image using Cloud Build
echo -e "\033[0;33m📦 Building container image...\033[0m"
gcloud builds submit --tag $IMAGE_NAME .

# 2. Deploy to Cloud Run
echo -e "\033[0;33m🌎 Deploying to Cloud Run...\033[0m"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --timeout 300

echo -e "\033[0;32m✅ Deployment Complete!\033[0m"
URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')
echo -e "\033[1;37m🔗 Service URL: $URL\033[0m"
echo -e "\033[0;35m💡 Update your .env.local: VITE_OFFLINE_PARSER_URL=$URL\033[0m"
