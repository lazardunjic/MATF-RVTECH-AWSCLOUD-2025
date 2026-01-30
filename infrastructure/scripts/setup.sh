#!/bin/bash

echo "Setting up the development environment..."
echo ""

echo "Starting LocalStack..."
cd infrastructure/localstack
docker-compose up -d

echo "LocalStack is starting up... Please wait..."
sleep 10

if docker ps | grep -q localstack; then
    echo "LocalStack is running."
else
    echo "Failed to start LocalStack."
    exit 1
fi
echo ""

echo "Deploying backend..."
cd ../../backend
npm install
npm run deploy

if [ $? -ne 0 ]; then
    echo "Deploy failed"
    exit 1
fi
echo "Backend deployed"
echo ""

echo "Syncing data from Open Charge Map..."
awslocal lambda invoke \
  --function-name charging-map-dev-syncOCMData \
  --invocation-type Event \
  /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Sync started (running in background)"
else
    echo "Sync failed"
fi

echo "Waiting for sync to complete..."
sleep 20
echo ""

echo "Verifying data..."
awslocal lambda invoke \
  --function-name charging-map-dev-getChargers \
  /tmp/verify.json >/dev/null 2>&1

COUNT=$(cat /tmp/verify.json 2>/dev/null | jq -r '.body' | jq -r '.count' 2>/dev/null || echo "0")

if [ "$COUNT" -gt "0" ]; then
    echo "Successfully synced $COUNT chargers"
else
    echo "No chargers found - check logs"
fi
echo ""

API_ID=$(awslocal apigateway get-rest-apis --query 'items[0].id' --output text 2>/dev/null)
API_URL="http://localhost:4566/restapis/$API_ID/dev/_user_request_"

echo "Setup Completed!"
echo "API ID: $API_ID"
echo "API Gateway URL: $API_URL/chargers"
echo ""
