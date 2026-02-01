const https = require('https');
const { dynamodb } = require('../lib/dynamodb');

const COUNTRY_CODE_MAP = {
  'RS': 'Serbia',
  'HR': 'Croatia',
  'BA': 'Bosnia and Herzegovina',
  'ME': 'Montenegro',
  'MK': 'North Macedonia',
  'SI': 'Slovenia',
  'XK': 'Serbia'
};

async function fetchFromOCM(){
    const countries = ['RS', 'HR', 'BA', 'ME', 'MK', 'SI', 'XK'];
    const allChargers = [];
    
    console.log(`Fetching chargers from ${countries.length} EX-YU countries...`);
    
    for (const country of countries) {
        try {
            const params = new URLSearchParams({
                output: 'json',
                countrycode: country,
                maxresults: '500',
                compact: 'false',
                verbose: 'false',
                key: process.env.OCM_API_KEY
            });
            
            const url = `https://api.openchargemap.io/v3/poi/?${params.toString()}`;
            console.log(`Fetching from ${country}...`);
            
            const data = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            console.log(`  ✓ ${country}: ${parsed.length} chargers`);
                            resolve(parsed);
                        } catch (error) {
                            reject(new Error(`Failed to parse ${country} response`));
                        }
                    });
                }).on('error', reject);
            });
            
            const chargersWithCountry = data.map(charger => ({
              ...charger,
              _countryCode: country
            }));

            allChargers.push(...chargersWithCountry);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`Error fetching ${country}:`, error.message);
        }
    }
    
    console.log(`Total chargers fetched: ${allChargers.length}`);
    return allChargers;
}

function transformCharger(ocmCharger) {
  const connection = ocmCharger.Connections?.[0] || {};
  const address = ocmCharger.AddressInfo || {};
  
  const countryName = address.Country?.Title || 
                      COUNTRY_CODE_MAP[ocmCharger._countryCode] || 
                      'Unknown';

  return {
    chargeId: String(ocmCharger.ID),
    title: address.Title || 'Unknown Charging Station',
    latitude: address.Latitude || 0,
    longitude: address.Longitude || 0,
    town: address.Town || 'Unknown',
    address: address.AddressLine1 || '',
    postcode: address.Postcode || '',
    stateOrProvince: address.StateOrProvince || '',
    country: countryName,
    phone: address.ContactTelephone1 || null,
    website: address.RelatedURL || null,
    powerKW: connection.PowerKW || 0,
    voltage: connection.Voltage || 0,
    amps: connection.Amps || 0,
    connectionType: connection.ConnectionType?.Title || 'Unknown',
    currentType: connection.CurrentType?.Title || 'Unknown',
    quantity: connection.Quantity || 1,
    status: ocmCharger.StatusType?.Title || 'Unknown',
    usageType: ocmCharger.UsageType?.Title || 'Unknown',
    operatorName: ocmCharger.OperatorInfo?.Title || 'Unknown',
    numberOfPoints: ocmCharger.NumberOfPoints || 1,
    connectionComments: connection.Comments || '',
    generalComments: ocmCharger.GeneralComments || '',
    ocmId: ocmCharger.ID,
    ocmUUID: ocmCharger.UUID || null,
    lastVerified: ocmCharger.DateLastVerified || null,
    dateCreated: ocmCharger.DateCreated || null,
    lastSyncedAt: new Date().toISOString()
  };
}

async function saveToDynamoDB(items) {
  const tableName = process.env.CHARGERS_TABLE || 'charging-map-chargers-dev';
  console.log(`Saving ${items.length} items to DynamoDB table: ${tableName}`);
  
  const batchSize = 25;
  let savedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const params = {
      RequestItems: {
        [tableName]: batch.map(item => ({
          PutRequest: { Item: item }
        }))
      }
    };
    
    try {
      await dynamodb.batchWrite(params).promise();
      savedCount += batch.length;
      console.log(`Batch ${Math.floor(i / batchSize) + 1}: Saved ${batch.length} items (Total: ${savedCount}/${items.length})`);
    } catch (error) {
      errorCount += batch.length;
      console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
    }
  }
  
  console.log(`Save complete: ${savedCount} saved, ${errorCount} errors`);
  return { savedCount, errorCount };
}

exports.handler = async (event) => {
  console.log('=== Starting OCM Sync ===');
  const startTime = Date.now();
  
  try {
    const ocmData = await fetchFromOCM();
    
    if (!ocmData || ocmData.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          message: 'No chargers found',
          count: 0
        })
      };
    }
    
    const transformedItems = ocmData.map(transformCharger);
    const { savedCount, errorCount } = await saveToDynamoDB(transformedItems);
    const duration = Date.now() - startTime;
    
    console.log('=== Sync Complete ===');
    console.log(`Duration: ${duration}ms, Saved: ${savedCount}, Errors: ${errorCount}`);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Sync completed successfully',
        stats: {
          fetched: ocmData.length,
          saved: savedCount,
          errors: errorCount,
          duration: `${duration}ms`
        },
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('=== Sync Error ===', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};