#!/bin/bash

echo "Destroying infrastructure..."

cd backend
npm run remove

cd ../infrastructure/localstack
docker-compose down -v

echo "Destroy complete!"