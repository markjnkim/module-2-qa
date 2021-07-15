// Import the DynamoDB service
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
// Get the table name from environment variable
const tableName = process.env.TABLE_NAME;

exports.getAllThoughtsHandler = async (event) => {
  // All log statements are written to CloudWatch
  console.info('received: ', event);
  console.info('headers: ', 'added');

  const params = {
    TableName: tableName,
  };
  // Read all Items in table
  const { Items } = await docClient.scan(params).promise();
  // Sort the data by the timestamp
  const _sortItems = await Items.sort((a, b) => {
    a.createdAt < b.createdAt ? 1 : -1
  });

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify(Items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
