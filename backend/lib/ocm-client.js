const https = require('https');

const OCM_API_KEY = process.env.OCM_API_KEY;
const OCM_BASE_URL = 'https://api.openchargemap.io/v3/poi/';

const fetchChargers = (country = 'RS', maxResults = 200) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      output: 'json',
      countrycode: country,
      maxresults: maxResults.toString(),
      compact: 'true',
      verbose: 'false',
      key: OCM_API_KEY
    });
    
    const url = `${OCM_BASE_URL}?${params.toString()}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error('Failed to parse OCM response'));
        }
      });
    }).on('error', reject);
  });
};

const transformCharger = (ocmCharger) => {
  const connection = ocmCharger.Connections?.[0] || {};
  const address = ocmCharger.AddressInfo || {};
  
  return {
    chargeId: String(ocmCharger.ID),
    title: address.Title || 'Unknown Charging Station',
    latitude: address.Latitude || 0,
    longitude: address.Longitude || 0,
    town: address.Town || 'Unknown',
    // ... rest of transformation
  };
};

module.exports = {
  fetchChargers,
  transformCharger
};