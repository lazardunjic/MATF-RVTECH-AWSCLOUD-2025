#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Verify Token Testing Script ===${NC}\n"

# Login first
echo "Logging in..."
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

echo -e "${GREEN}✓ Login successful${NC}"
echo "Token: ${TOKEN:0:50}..."

# Test 1: Verify valid token
echo -e "\n${YELLOW}Test 1: Verify Valid Token${NC}"
awslocal lambda invoke \
  --function-name charging-map-dev-verifyToken \
  --cli-binary-format raw-in-base64-out \
  --payload "{\"headers\":{\"Authorization\":\"Bearer $TOKEN\"}}" \
  /tmp/verify.json > /dev/null 2>&1

RESULT=$(cat /tmp/verify.json)
SUCCESS=$(echo $RESULT | jq -r '.body' | jq -r '.success')

if [ "$SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Token verified${NC}"
    echo $RESULT | jq '.body' | jq -r '.' | jq '.user'
else
    echo -e "${RED}✗ Token verification failed${NC}"
    echo $RESULT | jq '.'
fi

# Test 2: Invalid token
echo -e "\n${YELLOW}Test 2: Invalid Token${NC}"
awslocal lambda invoke \
  --function-name charging-map-dev-verifyToken \
  --cli-binary-format raw-in-base64-out \
  --payload '{"headers":{"Authorization":"Bearer invalid_token_here"}}' \
  /tmp/verify-invalid.json > /dev/null 2>&1

INVALID_RESULT=$(cat /tmp/verify-invalid.json)
INVALID_SUCCESS=$(echo $INVALID_RESULT | jq -r '.body' | jq -r '.success')

if [ "$INVALID_SUCCESS" == "false" ]; then
    echo -e "${GREEN}✓ Invalid token correctly rejected${NC}"
    echo "Error: $(echo $INVALID_RESULT | jq -r '.body' | jq -r '.error')"
else
    echo -e "${RED}✗ Invalid token should have been rejected${NC}"
fi

# Test 3: Missing token
echo -e "\n${YELLOW}Test 3: Missing Token${NC}"
awslocal lambda invoke \
  --function-name charging-map-dev-verifyToken \
  --cli-binary-format raw-in-base64-out \
  --payload '{"headers":{}}' \
  /tmp/verify-missing.json > /dev/null 2>&1

MISSING_RESULT=$(cat /tmp/verify-missing.json)
MISSING_ERROR=$(echo $MISSING_RESULT | jq -r '.body' | jq -r '.error')

if [[ "$MISSING_ERROR" == *"required"* ]]; then
    echo -e "${GREEN}✓ Missing token correctly rejected${NC}"
    echo "Error: $MISSING_ERROR"
else
    echo -e "${RED}✗ Should reject missing token${NC}"
fi

echo -e "\n${GREEN}=== All Tests Complete ===${NC}"