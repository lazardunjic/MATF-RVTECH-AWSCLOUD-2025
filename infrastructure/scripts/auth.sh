#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' 

echo -e "${YELLOW}=== Auth Testing Script ===${NC}\n"

# Get User Pool ID
echo "Getting User Pool ID..."
USER_POOL_ID=$(awslocal cognito-idp list-user-pools --max-results 10 --query 'UserPools[0].Id' --output text)
echo -e "User Pool ID: ${GREEN}$USER_POOL_ID${NC}\n"

# Get Client ID
echo "Getting Client ID..."
CLIENT_ID=$(awslocal cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --query 'UserPoolClients[0].ClientId' --output text)
echo -e "Client ID: ${GREEN}$CLIENT_ID${NC}\n"

# Test credentials
TEST_EMAIL="test@example.com"
TEST_PASSWORD="Test1234!"

# Check if user exists
echo "Checking if test user exists..."
EXISTING_USER=$(awslocal cognito-idp list-users --user-pool-id $USER_POOL_ID --query "Users[?Attributes[?Name=='email' && Value=='$TEST_EMAIL']].Username" --output text)

if [ ! -z "$EXISTING_USER" ]; then
    echo -e "${YELLOW}User exists, deleting...${NC}"
    awslocal cognito-idp admin-delete-user \
        --user-pool-id $USER_POOL_ID \
        --username $EXISTING_USER
    echo -e "${GREEN}User deleted${NC}\n"
fi

# Create test user
echo "Creating test user..."
awslocal cognito-idp admin-create-user \
    --user-pool-id $USER_POOL_ID \
    --username $TEST_EMAIL \
    --temporary-password TempPass123! \
    --message-action SUPPRESS > /dev/null 2>&1

# Set permanent password
awslocal cognito-idp admin-set-user-password \
    --user-pool-id $USER_POOL_ID \
    --username $TEST_EMAIL \
    --password $TEST_PASSWORD \
    --permanent > /dev/null 2>&1

echo -e "${GREEN}Test user created!${NC}"
echo -e "Email: ${GREEN}$TEST_EMAIL${NC}"
echo -e "Password: ${GREEN}$TEST_PASSWORD${NC}\n"

# Test login via Lambda
echo -e "${YELLOW}Testing login via Lambda...${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-login \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"body\":\"{\\\"email\\\":\\\"$TEST_EMAIL\\\",\\\"password\\\":\\\"$TEST_PASSWORD\\\"}\"}" \
    /tmp/login-response.json > /dev/null 2>&1

RESPONSE=$(cat /tmp/login-response.json)
SUCCESS=$(echo $RESPONSE | jq -r '.body' | jq -r '.success')

if [ "$SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Login successful!${NC}\n"
    echo "Response:"
    echo $RESPONSE | jq '.body' | jq -r '.' | jq '.'
else
    echo -e "${RED}✗ Login failed!${NC}\n"
    echo "Response:"
    echo $RESPONSE | jq '.'
fi

# Test via API Gateway
echo -e "\n${YELLOW}Testing login via API Gateway...${NC}"
API_ID=$(awslocal apigateway get-rest-apis --query 'items[0].id' --output text)
echo -e "API ID: ${GREEN}$API_ID${NC}"

curl -s -X POST http://localhost:4566/restapis/$API_ID/dev/_user_request_/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
    --max-time 5 | jq '.'

echo -e "\n${GREEN}=== Test Complete ===${NC}"