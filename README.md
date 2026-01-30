# 🚗⚡ EV Charging Map - Balkan Region

Serverless application for locating electric vehicle charging stations across the Balkan region. Built with AWS Lambda, DynamoDB, and LocalStack for the AWS Cloud course 2025/2026.

## 🏗️ Architecture

**Serverless Backend:**
- **AWS Lambda** - 4 serverless functions for data sync and retrieval
- **DynamoDB** - NoSQL database for ~2500+ charging stations
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

# Setup infrastructure, deploy backend, and sync data
./infrastructure/scripts/setup.sh
```

This will:
1. Start LocalStack container
2. Deploy 4 Lambda functions
3. Create DynamoDB table
4. Sync ~2500+ charging stations from Balkan region
5. Display API Gateway URL and stats

## 🛠️ Development

### Backend
```bash
cd backend

# Deploy changes
npm run deploy
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📡 API Endpoints

TO DO

## 📊 Tech Stack

**Backend:**
- AWS Lambda (Node.js 18)
- DynamoDB (NoSQL database)
- API Gateway (REST API)
- Serverless Framework v3

**Frontend:**
- React 18
- Leaflet.js (interactive maps)
- Axios (HTTP client)

**Infrastructure:**
- LocalStack (AWS emulation)
- Docker & Docker Compose
- Serverless-LocalStack plugin

**Data Source:**
- Open Charge Map API

## 🧪 Testing
TO DO
## 🔮 Roadmap

- [x] Backend API with Lambda functions
- [x] DynamoDB data storage
- [x] Balkan-wide charging station coverage (~2500+ stations)
- [x] Frontend with interactive map
- [ ] AWS Cognito authentication
- [ ] Favorite stations feature
- [ ] Real-time availability status
- [ ] Mobile responsive design
- [ ] Search by connector type
- [ ] Export stations to CSV/JSON

## 👤 Author
Lazar Dunjic  265/2021
