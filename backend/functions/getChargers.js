const { dynamodb } = require('../lib/dynamodb');

exports.handler = async (event) => {
  console.log('Getting chargers from DynamoDB...');
  
  try {
    const queryParams = event.queryStringParameters || {};
    const { limit, town, minPower, status } = queryParams;
    
    const tableName = process.env.CHARGERS_TABLE || 'charging-map-chargers-dev';
    const params = { TableName: tableName };
    
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
    
    if (minPower) {
      filterExpressions.push('powerKW >= :minPower');
      params.ExpressionAttributeValues[':minPower'] = Number(minPower);
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
        chargers: result.Items
      })
    };
  } catch (error) {
    console.error('Error getting chargers:', error);
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