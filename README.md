# 🚗⚡ EV Charging Map - EX YU Region

Serverless application for locating electric vehicle charging stations across the EX YU region. Built with AWS Lambda, DynamoDB, and LocalStack for the Rivian AWS Cloud course 2025/2026.

## 🏗️ Architecture

**Serverless Backend:**
- **AWS Lambda** - 4 core serverless functions for data sync and retrieval, with aditional 4 for auth
- **DynamoDB** - NoSQL database for charging stations
- **API Gateway** - RESTful API endpoints
- **LocalStack** - Local AWS cloud emulation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS CLI v2 with `awslocal` wrapper
- LocalStack
- jq (for JSON parsing in scripts)

### One-Command Setup
```bash
# Clone repository
git clone https://github.com/lazardunjic/MATF-RVTECH-AWSCLOUD-2025.git
cd MATF-RVTECH-AWSCLOUD-2025

# Do all setup with
./infrastructure/scripts/setup.sh

# Undo all setup with
./infrastructure/scripts/destroy.sh
```

This will:
1. Start LocalStack container
2. Deploy Lambda functions
3. Create DynamoDB table
4. Sync data
5. Display API Gateway URL and stats
6. Show map with chargers

## 📊 Tech Stack

**Backend:**
- AWS Lambda (Node.js 18)
- DynamoDB (NoSQL database)
- API Gateway (REST API)
- Serverless Framework v3

**Frontend:**
- React 18
- Leaflet.js (interactive maps & navigation) 
- Axios (HTTP client)

**Infrastructure:**
- LocalStack (AWS emulation)
- Docker & Docker Compose
- Serverless-LocalStack plugin

**Data Source:**
- [Open Charge Map](https://openchargemap.org/) 

## 🧪 Testing
### Backend API Testing

Created automated shell scripts to test authentication functionality instead of traditional unit tests. These scripts test the complete flow including LocalStack, Cognito, Lambda functions, and API Gateway.

#### Available Test Scripts

All test scripts are located in `infrastructure/scripts/`:

1. **`auth.sh`** - Tests login functionality
```bash
   ./infrastructure/scripts/test-auth.sh
```
   - Creates a test user in Cognito
   - Tests login via Lambda
   - Tests login via API Gateway
   - Validates JWT token generation

2. **`test-register.sh`** - Tests user registration
```bash
   ./infrastructure/scripts/register.sh
```
   - Tests new user registration
   - Confirms user in Cognito
   - Tests duplicate registration rejection
   - Validates login with newly registered user
   - Tests registration via API Gateway

3. **`test-verify.sh`** - Tests token verification
```bash
   ./infrastructure/scripts/verify.sh
```
   - Tests valid token verification
   - Tests invalid token rejection
   - Tests missing token handling
   - Validates user information extraction from JWT

4. **`logout.sh`** - Tests logout functionality
```bash
   ./infrastructure/scripts/test-logout.sh
```
   - Tests logout with valid token
   - Validates token invalidation after logout
   - Tests logout with invalid token
   - Tests logout without token

## 🔮 Roadmap

- [x] Backend API with Lambda functions
- [x] DynamoDB data storage
- [x] EX YU-wide charging station coverage 
- [x] Frontend with interactive map
- [x] GPS feature
- [x] Search/Filter by various parameters
- [x] AWS Cognito authentication

## 👤 Author
Lazar Dunjic  265/2021
