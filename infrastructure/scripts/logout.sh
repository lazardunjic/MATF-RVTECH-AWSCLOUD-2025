#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

echo -e "${YELLOW}=== Logout Testing Script ===${NC}\n"

# Test 1: Login to get token
echo -e "${BLUE}=== Test 1: Login to Get Token ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-login \
    --cli-binary-format raw-in-base64-out \
    --payload '{"body":"{\"email\":\"test@example.com\",\"password\":\"Test1234!\"}"}' \
    /tmp/login.json > /dev/null 2>&1

TOKEN=$(cat /tmp/login.json | jq -r '.body' | jq -r '.tokens.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Login failed - cannot get token${NC}"
    exit 1
fi

echo -e "${GREEN}Login successful${NC}"
echo "Token: ${TOKEN:0:50}..."

# Test 2: Verify token before logout
echo -e "\n${BLUE}=== Test 2: Verify Token (Before Logout) ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-verifyToken \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"headers\":{\"Authorization\":\"Bearer $TOKEN\"}}" \
    /tmp/verify-before.json > /dev/null 2>&1

BEFORE_SUCCESS=$(cat /tmp/verify-before.json | jq -r '.body' | jq -r '.success')

if [ "$BEFORE_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Token is valid before logout${NC}"
    cat /tmp/verify-before.json | jq '.body' | jq -r '.' | jq '.user.email'
else
    echo -e "${RED}✗ Token should be valid before logout${NC}"
    exit 1
fi

# Test 3: Logout
echo -e "\n${BLUE}=== Test 3: Logout ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-logout \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"headers\":{\"Authorization\":\"Bearer $TOKEN\"}}" \
    /tmp/logout.json > /dev/null 2>&1

LOGOUT_RESULT=$(cat /tmp/logout.json)
LOGOUT_SUCCESS=$(echo $LOGOUT_RESULT | jq -r '.body' | jq -r '.success')

if [ "$LOGOUT_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Logout successful${NC}"
    echo "Message: $(echo $LOGOUT_RESULT | jq -r '.body' | jq -r '.message')"
else
    echo -e "${RED}✗ Logout failed${NC}"
    echo $LOGOUT_RESULT | jq '.'
    exit 1
fi

# Test 4: Verify token after logout (should fail)
echo -e "\n${BLUE}=== Test 4: Verify Token (After Logout) ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-verifyToken \
    --cli-binary-format raw-in-base64-out \
    --payload "{\"headers\":{\"Authorization\":\"Bearer $TOKEN\"}}" \
    /tmp/verify-after.json > /dev/null 2>&1

AFTER_SUCCESS=$(cat /tmp/verify-after.json | jq -r '.body' | jq -r '.success')
AFTER_ERROR=$(cat /tmp/verify-after.json | jq -r '.body' | jq -r '.error')

if [ "$AFTER_SUCCESS" == "false" ]; then
    echo -e "${GREEN}✓ Token correctly invalidated after logout${NC}"
    echo "Error: $AFTER_ERROR"
else
    echo -e "${RED}✗ Token should be invalid after logout${NC}"
    cat /tmp/verify-after.json | jq '.'
fi

# Test 5: Try to logout with invalid token
echo -e "\n${BLUE}=== Test 5: Logout with Invalid Token ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-logout \
    --cli-binary-format raw-in-base64-out \
    --payload '{"headers":{"Authorization":"Bearer invalid_token"}}' \
    /tmp/logout-invalid.json > /dev/null 2>&1

INVALID_LOGOUT=$(cat /tmp/logout-invalid.json)
INVALID_SUCCESS=$(echo $INVALID_LOGOUT | jq -r '.body' | jq -r '.success')

if [ "$INVALID_SUCCESS" == "false" ]; then
    echo -e "${GREEN}✓ Invalid token logout correctly rejected${NC}"
    echo "Error: $(echo $INVALID_LOGOUT | jq -r '.body' | jq -r '.error')"
else
    echo -e "${RED}✗ Should reject invalid token${NC}"
fi

# Test 6: Try to logout without token
echo -e "\n${BLUE}=== Test 6: Logout without Token ===${NC}"
awslocal lambda invoke \
    --function-name charging-map-dev-logout \
    --cli-binary-format raw-in-base64-out \
    --payload '{"headers":{}}' \
    /tmp/logout-missing.json > /dev/null 2>&1

MISSING_LOGOUT=$(cat /tmp/logout-missing.json)
MISSING_ERROR=$(echo $MISSING_LOGOUT | jq -r '.body' | jq -r '.error')

if [[ "$MISSING_ERROR" == *"required"* ]]; then
    echo -e "${GREEN}✓ Missing token correctly rejected${NC}"
    echo "Error: $MISSING_ERROR"
else
    echo -e "${RED}✗ Should reject missing token${NC}"
fi

# Test 7: Test via API Gateway
echo -e "\n${BLUE}=== Test 7: Logout via API Gateway ===${NC}"

# Login again to get fresh token
awslocal lambda invoke \
    --function-name charging-map-dev-login \
    --cli-binary-format raw-in-base64-out \
    --payload '{"body":"{\"email\":\"test@example.com\",\"password\":\"Test1234!\"}"}' \
    /tmp/login2.json > /dev/null 2>&1

TOKEN2=$(cat /tmp/login2.json | jq -r '.body' | jq -r '.tokens.accessToken')

API_ID=$(awslocal apigateway get-rest-apis --query 'items[0].id' --output text)
echo -e "API ID: ${GREEN}$API_ID${NC}"

curl -s -X POST http://localhost:4566/restapis/$API_ID/dev/_user_request_/auth/logout \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN2" \
    --max-time 5 | jq '.'

echo -e "\n${GREEN}=== All Tests Complete ===${NC}"