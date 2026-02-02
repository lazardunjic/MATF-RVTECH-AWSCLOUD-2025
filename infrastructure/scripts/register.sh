#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

echo -e "${YELLOW}=== Register Testing Script ===${NC}\n"

# Get User Pool ID
echo "Getting User Pool ID..."
USER_POOL_ID=$(awslocal cognito-idp list-user-pools --max-results 10 --query 'UserPools[0].Id' --output text)
echo -e "User Pool ID: ${GREEN}$USER_POOL_ID${NC}\n"

# Get Client ID
echo "Getting Client ID..."
CLIENT_ID=$(awslocal cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --query 'UserPoolClients[0].ClientId' --output text)
echo -e "Client ID: ${GREEN}$CLIENT_ID${NC}\n"

# New user credentials
NEW_EMAIL="newuser@example.com"
NEW_PASSWORD="NewPass123!"
NEW_NAME="New User"

# Check if user already exists
echo "Checking if user exists..."
EXISTING_USER=$(awslocal cognito-idp list-users --user-pool-id $USER_POOL_ID --query "Users[?Attributes[?Name=='email' && Value=='$NEW_EMAIL']].Username" --output text)

if [ ! -z "$EXISTING_USER" ]; then
    echo -e "${YELLOW}User exists, deleting...${NC}"
    awslocal cognito-idp admin-delete-user \
        --user-pool-id $USER_POOL_ID \
        --username $EXISTING_USER
    echo -e "${GREEN}User deleted${NC}\n"
fi

# Test 1: Register via Lambda
echo -e "${BLUE}=== Test 1: Register New User ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-register \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"body\":\"{\\\"email\\\":\\\"$NEW_EMAIL\\\",\\\"password\\\":\\\"$NEW_PASSWORD\\\",\\\"name\\\":\\\"$NEW_NAME\\\"}\"}" \
    /tmp/register-response.json > /dev/null 2>&1

RESPONSE=$(cat /tmp/register-response.json)
SUCCESS=$(echo $RESPONSE | jq -r '.body' | jq -r '.success')

if [ "$SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Registration successful!${NC}\n"
    echo "Response:"
    echo $RESPONSE | jq '.body' | jq -r '.' | jq '.'
else
    echo -e "${RED}✗ Registration failed!${NC}\n"
    echo "Response:"
    echo $RESPONSE | jq '.'
    exit 1
fi

# Test 2: Confirm user (since LocalStack doesn't send real emails)
echo -e "\n${BLUE}=== Test 2: Confirm User ===${NC}"
awslocal cognito-idp admin-confirm-sign-up \
    --user-pool-id $USER_POOL_ID \
    --username $NEW_EMAIL > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ User confirmed${NC}\n"
else
    echo -e "${RED}✗ User confirmation failed${NC}\n"
fi

# Test 3: List users to verify
echo -e "${BLUE}=== Test 3: Verify User in Pool ===${NC}"
awslocal cognito-idp list-users --user-pool-id $USER_POOL_ID \
    --query "Users[?Attributes[?Name=='email' && Value=='$NEW_EMAIL']]" | jq '.'

# Test 4: Try to login with new user
echo -e "\n${BLUE}=== Test 4: Login with New User ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-login \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"body\":\"{\\\"email\\\":\\\"$NEW_EMAIL\\\",\\\"password\\\":\\\"$NEW_PASSWORD\\\"}\"}" \
    /tmp/login-new-response.json > /dev/null 2>&1

LOGIN_RESPONSE=$(cat /tmp/login-new-response.json)
LOGIN_SUCCESS=$(echo $LOGIN_RESPONSE | jq -r '.body' | jq -r '.success')

if [ "$LOGIN_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Login successful!${NC}\n"
    echo "Tokens received:"
    echo $LOGIN_RESPONSE | jq '.body' | jq -r '.' | jq '.tokens | keys'
else
    echo -e "${RED}✗ Login failed!${NC}\n"
    echo "Response:"
    echo $LOGIN_RESPONSE | jq '.'
fi

# Test 5: Try to register same user again (should fail)
echo -e "\n${BLUE}=== Test 5: Try Duplicate Registration ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-register \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"body\":\"{\\\"email\\\":\\\"$NEW_EMAIL\\\",\\\"password\\\":\\\"$NEW_PASSWORD\\\",\\\"name\\\":\\\"$NEW_NAME\\\"}\"}" \
    /tmp/register-duplicate.json > /dev/null 2>&1

DUPLICATE_RESPONSE=$(cat /tmp/register-duplicate.json)
DUPLICATE_ERROR=$(echo $DUPLICATE_RESPONSE | jq -r '.body' | jq -r '.error')

if [[ "$DUPLICATE_ERROR" == *"already exists"* ]]; then
    echo -e "${GREEN}✓ Duplicate registration correctly rejected${NC}"
    echo "Error: $DUPLICATE_ERROR"
else
    echo -e "${RED}✗ Duplicate registration should have been rejected${NC}"
    echo $DUPLICATE_RESPONSE | jq '.'
fi

# Test 6: Test via API Gateway
echo -e "\n${BLUE}=== Test 6: Register via API Gateway ===${NC}"
API_ID=$(awslocal apigateway get-rest-apis --query 'items[0].id' --output text)
echo -e "API ID: ${GREEN}$API_ID${NC}"

# Delete user first
awslocal cognito-idp admin-delete-user \
    --user-pool-id $USER_POOL_ID \
    --username $NEW_EMAIL > /dev/null 2>&1

curl -s -X POST http://localhost:4566/restapis/$API_ID/dev/_user_request_/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$NEW_EMAIL\",\"password\":\"$NEW_PASSWORD\",\"name\":\"$NEW_NAME\"}" \
    --max-time 5 | jq '.'

echo -e "\n${GREEN}=== All Tests Complete ===${NC}"