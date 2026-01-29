const AWS = require('aws-sdk');

const endpoint = process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';
const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: endpoint, 
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test'
});

exports.handler = async (event) => {
  const queryParams = event.queryStringParameters || {};
  const { q, town, minPower, maxPower, status, limit } = queryParams;
  
  console.log('Search params:', queryParams);
  
  try {
    const params = {
      TableName: process.env.CHARGERS_TABLE || 'charging-map-chargers-dev'
    };
    
    // Search by town using GSI
    if (town) {
      params.IndexName = 'TownIndex';
      params.KeyConditionExpression = 'town = :town';
      params.ExpressionAttributeValues = { ':town': town };
      
      if (limit) params.Limit = parseInt(limit);
      
      const result = await dynamodb.query(params).promise();
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          count: result.Count,
          chargers: result.Items
        })
      };
    }
    
    let filterExpressions = [];
    params.ExpressionAttributeValues = {};
    params.ExpressionAttributeNames = {};
    
    if (q) {
      filterExpressions.push('(contains(title, :q) OR contains(town, :q) OR contains(address, :q))');
      params.ExpressionAttributeValues[':q'] = q;
    }
    
    if (minPower) {
      filterExpressions.push('powerKW >= :minPower');
      params.ExpressionAttributeValues[':minPower'] = Number(minPower);
    }
    
    if (maxPower) {
      filterExpressions.push('powerKW <= :maxPower');
      params.ExpressionAttributeValues[':maxPower'] = Number(maxPower);
    }
    
    if (status) {
      filterExpressions.push('#status = :status');
      params.ExpressionAttributeNames['#status'] = 'status';
      params.ExpressionAttributeValues[':status'] = status;
    }
    
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }
    
    if (limit) params.Limit = parseInt(limit);
    
    const result = await dynamodb.scan(params).promise();
    console.log(`Found ${result.Count} chargers`);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        count: result.Count,
        chargers: result.Items,
        query: queryParams
      })
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};