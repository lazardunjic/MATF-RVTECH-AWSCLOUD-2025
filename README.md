# 🚗⚡ EV Charging Map - EX YU Region

Serverless application for locating electric vehicle charging stations across the EX YU region. Built with AWS Lambda, DynamoDB, and LocalStack for the Rivian AWS Cloud course 2025/2026.

## 🏗️ Architecture

**Serverless Backend:**
- **AWS Lambda** - 4 serverless functions for data sync and retrieval
- **DynamoDB** - NoSQL database for charging stations
- **API Gateway** - RESTful API endpoints
- **LocalStack** - Local AWS cloud emulation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS CLI v2 with `awslocal` wrapper
- jq (for JSON parsing in scripts)

### One-Command Setup
```bash
# Clone repository
git clone <repository-url>
cd MATF-RVTECH-AWSCLOUD-2025

# Do all setup with
./infrastructure/scripts/setup.sh

# Undo all setup with
./infrastructure/scripts/destroy.sh
```

This will:
1. Start LocalStack container
2. Deploy 4 Lambda functions
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
- Open Charge Map API

## 🧪 Testing
- WILL BE DONE IN FUTURE 

## 🔮 Roadmap

- [x] Backend API with Lambda functions
- [x] DynamoDB data storage
- [x] EX YU-wide charging station coverage 
- [x] Frontend with interactive map
- [x] GPS feature
- [x] Search by various parameters
- [ ] AWS Cognito authentication

## 👤 Author
Lazar Dunjic  265/2021
