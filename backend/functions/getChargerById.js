const { dynamodb } = require('../lib/dynamodb');

exports.handler = async (event) => {
  const chargeId = event.pathParameters?.id;
  
  if (!chargeId) {
    return {
      statusCode: 400,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'chargeId is required'
      })
    };
  }
  
  console.log(`Getting charger with ID: ${chargeId}`);
  
  try {
    const tableName = process.env.CHARGERS_TABLE || 'charging-map-chargers-dev';
    
    const params = {
      TableName: tableName,
      Key: { chargeId }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Charger not found'
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        charger: result.Item
      })
    };
  } catch (error) {
    console.error('Error:', error);
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