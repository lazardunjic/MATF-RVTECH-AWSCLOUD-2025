const AWS = require('aws-sdk');

const endpoint = process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: endpoint,
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
});

const tableName = process.env.CHARGERS_TABLE || 'charging-map-chargers-dev';

const scanTable = async (params = {}) => {
  return dynamodb.scan({
    TableName: tableName,
    ...params
  }).promise();
};

const getItem = async (key) => {
  return dynamodb.get({
    TableName: tableName,
    Key: key
  }).promise();
};

const putItem = async (item) => {
  return dynamodb.put({
    TableName: tableName,
    Item: item
  }).promise();
};

const batchWrite = async (items) => {
  const params = {
    RequestItems: {
      [tableName]: items.map(item => ({
        PutRequest: { Item: item }
      }))
    }
  };
  return dynamodb.batchWrite(params).promise();
};

module.exports = {
  dynamodb,
  tableName,
  scanTable,
  getItem,
  putItem,
  batchWrite
};