#!/bin/bash

echo "Updating API configuration..."

API_ID=$(awslocal apigateway get-rest-apis --query 'items[0].id' --output text 2>/dev/null)

if [ -z "$API_ID" ] || [ "$API_ID" == "None" ]; then
    echo "No API Gateway found"
    exit 1
fi

echo "Found API Gateway ID: $API_ID"

cat > frontend/src/config.js << JSEOF
// Auto-generated configuration
// Last updated: $(date)

export const API_BASE_URL = 'http://localhost:4566/restapis/$API_ID/dev/_user_request_';

export const API_ENDPOINTS = {
  GET_CHARGERS: \`\${API_BASE_URL}/chargers\`,
  GET_CHARGER_BY_ID: (id) => \`\${API_BASE_URL}/chargers/\${id}\`,
  SEARCH_CHARGERS: \`\${API_BASE_URL}/search\`,
  SYNC_DATA: \`\${API_BASE_URL}/sync\`
};
JSEOF

echo "Config updated!"
echo "API URL: http://localhost:4566/restapis/$API_ID/dev/_user_request_"